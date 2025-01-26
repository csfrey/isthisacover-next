import { pool } from "@/lib/db";
import { Vote } from "@/lib/types";

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
  const vote: Vote = await request.json();
  const client = await pool.connect();

  try {
    const result = await client.query<Vote>(
      "INSERT INTO Votes (spotifyid, iscover, isCorrection) VALUES ($1, $2, $3) RETURNING *;",
      [vote.spotifyid, vote.iscover, vote.isCorrection]
    );
    client.release();
    return Response.json(result.rows[0]);
  } catch {
    client.release();
    return Response.error();
  }
}
