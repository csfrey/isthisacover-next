"use client";

// import { parseTrack } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { motion } from "framer-motion";
import { Determination, Track } from "@/lib/types";
import { Button } from "@/components/ui/button";

const TrackView = () => {
  const { id } = useParams();
  const [voted, setVoted] = useState<boolean>(false);

  const determinationQuery = useQuery({
    queryKey: ["Determination", id],
    queryFn: async () => {
      const response = await axios.get(`/api/determination/${id}`);
      return response.data;
    },
  });

  const vote = useMutation({
    mutationKey: ["VoteMutation"],
    mutationFn: (iscover: boolean) => {
      setVoted(true);
      console.log(determination);
      return axios.post("/api/vote", {
        spotifyid: track.spotifyid,
        iscover,
        iscorrection: iscover !== determination.iscover,
      });
    },
  });

  const track: Track = useMemo(
    () => (determinationQuery.data ? determinationQuery.data.track : null),
    [determinationQuery.data]
  );

  const determination: Determination = useMemo(
    () =>
      determinationQuery.data ? determinationQuery.data.determination : null,
    [determinationQuery.data]
  );

  return (
    <div className="h-full flex flex-col p-4 max-w-[500px] mx-auto">
      {determinationQuery.isPending ? (
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
              <div className="col-span-3 flex flex-col justify-center overflow-x-hidden">
                <div className="font-bold text-nowrap">{track?.name}</div>
                <div className="font-thin">{track?.artist}</div>
              </div>
              <div className="col-span-1">
                {track?.spotifyid && (
                  <Link
                    href={track?.spotifylink || ""}
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
              {determination.iscover ? "is a cover" : "is not a cover"}
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
            {voted ? (
              <>
                <div className="text-center mt-10">Thanks for voting!</div>
              </>
            ) : (
              <>
                <div className="text-center text-lg mt-10">
                  <i>Is</i> <strong>{track?.name}</strong> <i>by</i>{" "}
                  <strong>{track?.artist}</strong> <i>a cover?</i>
                </div>
                <div className="flex justify-center gap-4 mt-6 mb-12">
                  <Button
                    className="w-32 border-2 border-gray-600 bg-opacity-0 hover:bg-opacity-100"
                    onClick={() => vote.mutate(true)}
                  >
                    <LuThumbsUp />
                    Cover
                  </Button>
                  <Button
                    className="w-32 border-2 border-gray-600 bg-opacity-0 hover:bg-opacity-100"
                    onClick={() => vote.mutate(false)}
                  >
                    <LuThumbsDown />
                    Not a cover
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default TrackView;
