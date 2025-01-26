import { spotifyClient } from "@/lib/spotify";
import { openai, assistant, isInitialized, init } from "@/lib/openai";
import { parseTrack } from "@/lib/utils";
import { pool } from "@/lib/db";
import { Determination, Vote } from "@/lib/types";

const MIN_VOTES = 10;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("--> getting track info");
  const spotifyTrackResult = await spotifyClient.tracks.get(params.id);
  const track = parseTrack(spotifyTrackResult);

  console.log("--> checking db");
  // First, check the DB to see if we've made a determination for the track already

  const client = await pool.connect();
  try {
    const determinationResult = await client.query<Determination>(
      "SELECT * FROM Determinations WHERE spotifyid = $1;",
      [track.spotifyid]
    );

    let determination =
      determinationResult.rows.length > 0 ? determinationResult.rows[0] : null;

    if (determination) {
      console.log(
        "--> found a determination in the db, comparing with user votes"
      );

      const votesResult = await client.query<Vote>(
        "SELECT * FROM Votes WHERE spotifyid = $1",
        [track.spotifyid]
      );
      const votes = votesResult.rows;

      if (votes.length > MIN_VOTES) {
        let yesVotes = 0;
        let noVotes = 0;

        votes.forEach((vote) => {
          let score = vote.iscorrection ? 0.9 : 1; // accounting for Cunningham's Law

          if (vote.iscover) {
            yesVotes += score;
          } else {
            noVotes += score;
          }
        });

        const isCoverByVotes = yesVotes > noVotes;

        // update the determination if it should be changed based on the votes
        if (isCoverByVotes !== determination.iscover) {
          const updateDeterminationResult = await client.query<Determination>(
            "UPDATE Determinations SET iscover = $1 WHERE spotifyid = $2",
            [isCoverByVotes, track.spotifyid]
          );
          determination = updateDeterminationResult.rows[0];
        }
      }

      return Response.json({
        track,
        determination,
      });
    }

    client.release();
  } catch (error) {
    client.release();
    return Response.error();
  }

  // if (determination) {
  //   console.log("--> found it in the db ");

  //   return Response.json({
  //     track,
  //     determination,
  //   });
  // }

  console.log("--> not in the db, asking chatgpt");
  // Second, if no determination has been made, ask the AI to make a guess
  if (!isInitialized) {
    await init();
  }

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: `"${track.name}" by ${track.artist}`,
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  let guess;
  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const content: any = messages.data[0].content[0];

    let unparsed: string = content.text.value;

    try {
      guess = JSON.parse(unparsed);
    } catch {
      // if the parse failed, try stripping out extra characters and parsing again
      const matches = unparsed.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      try {
        guess = JSON.parse(matches?.[1] || "{}");
      } catch {
        // if that didn't work, give up
        return Response.error();
      }
    }
  } else {
    console.error("OpenAI thread did not complete!");
    return Response.error();
  }

  console.log(`--> chatgpt says: ${guess}`);

  console.log("--> storing new determination");
  // Third, store the AI's guess in the DB
  let newDetermination: Determination;
  try {
    const client = await pool.connect();
    const result = await client.query<Determination>(
      "INSERT INTO Determinations (spotifyid, iscover, gptiscover) VALUES ($1, $2, $3) RETURNING *;",
      [track.spotifyid, guess.iscover, guess.iscover]
    );

    if (result.rows.length <= 0) throw new Error();

    newDetermination = result.rows[0];

    client.release();
  } catch {
    client.release();
    return Response.error();
  }

  console.log("--> done");
  // Finally, return the track info and the guess
  return Response.json({
    track,
    determination: newDetermination,
  });
}
