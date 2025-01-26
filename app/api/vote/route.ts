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

    client.release();
    return Response.json(voteResult.rows[0]);
  } catch {
    client.release();
    return Response.error();
  }
}
