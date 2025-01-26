import { pool } from "@/lib/db";
import { Vote } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  try {
    const result = await client.query<Vote>(
      "SELECT * FROM Votes WHERE spotifyid = $1",
      [params.id]
    );
    client.release();

    return Response.json(result.rows[0]);
  } catch {
    client.release();
    return Response.error();
  }
}
