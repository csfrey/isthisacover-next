"use client";

import { parseTrack } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ScaleLoader } from "react-spinners";

const TrackView = () => {
  const { id } = useParams();

  const trackQuery = useQuery({
    queryKey: ["Track", id],
    queryFn: async () => {
      const response = await axios.get(`/api/track/${id}`);
      return response.data;
    },
  });

  const determinationQuery = useQuery({
    queryKey: ["Determination", id],
    queryFn: async () => {
      const response = await axios.get(`/api/determination/${id}`);
      return response.data;
    },
  });

  const track = useMemo(
    () => (trackQuery.data ? parseTrack(trackQuery.data) : null),
    [trackQuery.data]
  );

  return (
    <div className="flex flex-col justify-center ">
      {trackQuery.isPending ? (
        <ScaleLoader color="#1ED760" />
      ) : (
        <div className="w-[500px] border border-gray-500 rounded p-4 flex gap-4">
          <img
            src={track?.imageUrl || ""}
            alt="album art"
            className="w-48 h-48"
          />
          <div className="grow">
            <div className="text-2xl">{track?.artist}</div>
            <div className="text-5xl font-bold">{track?.name}</div>
            <div className="text-lg italic">{track?.album}</div>
          </div>
          {track?.spotifyID && (
            <Link
              href={track?.spotifyLink || ""}
              target="_blank"
              className="h-8 w-8 float-right"
            >
              <img src="/spotify_logo.png" alt="spotify logo links to song" />
            </Link>
          )}
        </div>
      )}
      <div>
        {determinationQuery.isPending
          ? "Analyzing..."
          : JSON.stringify(determinationQuery.data)}
      </div>
    </div>
  );
};

export default TrackView;
