import { spotifyClient } from "@/lib/spotify";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const result = await spotifyClient.tracks.get(params.id);

  return Response.json(result);
}
