import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Track } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTrack(rawTrack: any): Track {
  return {
    spotifyID: rawTrack.id,
    name: rawTrack.name,
    album: rawTrack.album.name,
    artist: rawTrack.artists.map((artist: any) => artist.name).join(", "),
    imageUrl: rawTrack.album.images?.[0].url || "",
  };
}
