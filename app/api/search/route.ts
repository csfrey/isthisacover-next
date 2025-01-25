import { spotifyClient } from "@/lib/spotify";

export async function POST(request: Request) {
  const res = await request.json();

  const result = await spotifyClient.search(res.search, ["track"]);
  // console.log(result);

  return Response.json(result);
}
