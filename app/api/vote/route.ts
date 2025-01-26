import { pool } from "@/lib/db";
import { Determination, Vote } from "@/lib/types";

// get all
export async function GET(request: Request) {
  const client = await pool.connect();
  try {
    const result = await client.query<Vote>("SELECT * FROM Votes;");
    client.release();
    return Response.json(result.rows);
  } catch {
    client.release();
    return Response.error();
  }
}

const MIN_VOTES = 10;

// post new
export async function POST(request: Request) {
  const newVote: Vote = await request.json();
  const client = await pool.connect();

  try {
    // log the new vote
    const voteResult = await client.query<Vote>(
      "INSERT INTO Votes (spotifyid, iscover, iscorrection) VALUES ($1, $2, $3) RETURNING *;",
      [newVote.spotifyid, newVote.iscover, newVote.iscorrection]
    );

    // // pull the determination and all votes on it
    // const determinationResult = await client.query<Determination>(
    //   "SELECT * FROM Determination WHERE spotifyid = $1",
    //   [newVote.spotifyid]
    // )
    // const determination = determinationResult.rows[0]

    // const allVotesResult = await client.query<Vote>(
    //   "SELECT * FROM Votes WHERE spotifyid = $1",
    //   [newVote.spotifyid]
    // )
    // const votes = allVotesResult.rows

    // // assess votes

    // // require a certain number of votes to make an assesment
    // if (votes.length >= MIN_VOTES) {
    //   let yesVotes = 0;
    //   let noVotes = 0;

    //   votes.forEach(vote => {
    //     let score = vote.iscorrection ? 0.9 : 1; // accounting for Cunningham's Law

    //     if (vote.iscover) {
    //       yesVotes += score
    //     } else {
    //       noVotes += score
    //     }
    //   })

    //   const isCoverByVotes = yesVotes > noVotes;

    //   if (isCoverByVotes !== determination.iscover) {

    //   }
    // }

    client.release();
    return Response.json(voteResult.rows[0]);
  } catch {
    client.release();
    return Response.error();
  }
}
