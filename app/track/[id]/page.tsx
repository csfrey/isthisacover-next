"use client";

import { parseTrack } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ScaleLoader } from "react-spinners";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { motion } from "framer-motion";

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

  const abbreviatedTrackName = useMemo(() => {
    if (!!track) {
      if (track.name.length > 32) {
        return track.name.substring(0, 32) + "...";
      }
      return track.name;
    }

    return "";
  }, [track]);

  return (
    <div className="h-full flex flex-col p-4 max-w-[500px] mx-auto">
      {trackQuery.isPending || determinationQuery.isPending ? (
        <div className="mt-24">
          <div className="text-center text-3xl mb-10">Analyzing</div>
          <div className="flex justify-center">
            <ScaleLoader color="#1ED760" height={60} width={20} />
          </div>
        </div>
      ) : (
        <section className="">
          <div className="mt-16">
            <motion.div
              className="bg-gray-600 mx-auto shadow rounded p-4 grid grid-cols-6 gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="col-span-2">
                <img src={track?.imageUrl || ""} alt="album art" />
              </div>
              <div className="col-span-3 flex flex-col justify-center">
                <div className="font-bold">{abbreviatedTrackName}</div>
                <div className="font-thin">{track?.artist}</div>
              </div>
              <div className="col-span-1">
                {track?.spotifyID && (
                  <Link
                    href={track?.spotifyLink || ""}
                    target="_blank"
                    className="h-8 w-8 float-right"
                  >
                    <img
                      src="/spotify_logo.png"
                      alt="spotify logo links to song"
                    />
                  </Link>
                )}
              </div>
            </motion.div>
            <motion.div
              className="text-center text-4xl mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {determinationQuery.data?.isCover
                ? "is a cover"
                : "is not a cover"}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center mt-16">
              Did we get it right? Vote below!
            </div>
            <div className="text-center text-lg mt-10">
              <i>Is</i> <strong>{track?.name}</strong> <i>by</i>{" "}
              <strong>{track?.artist}</strong> <i>a cover?</i>
            </div>
            <div className="flex justify-center space-x-8 mt-6 text-4xl">
              <div className="rounded-full p-4 hover:bg-slate-500 hover:bg-opacity-50">
                <LuThumbsUp />
              </div>
              <div className="rounded-full p-4 hover:bg-slate-500 hover:bg-opacity-50">
                <LuThumbsDown />
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default TrackView;
