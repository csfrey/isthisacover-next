import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const spotifyClient = SpotifyApi.withClientCredentials(
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET as string
);
