"use client";

import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseTrack } from "@/lib/utils";
import { Track } from "@/lib/types";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["SpotifySearch", search],
    queryFn: async () => {
      const results = await axios.post("/api/search", {
        search,
      });
      return results.data;
    },
  });

  const tracks: Track[] = useMemo(
    () => data?.items.map(parseTrack) || [],
    [data]
  );

  function onSelectItem(spotifyID: string) {
    // open selected track
    setOpen(false);
  }

  return (
    <main className="min-h-screen flex justify-center items-center dark:bg-gray-950 dark:text-white">
      <div className="mb-12 lg:w-[500px] sm:w-full sm:mx-4">
        <div className="text-center text-3xl mb-2">Is this a cover?</div>
        <div className="flex items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <Command shouldFilter={false}>
              <PopoverAnchor asChild>
                <CommandPrimitive.Input
                  asChild
                  value={search}
                  onValueChange={setSearch}
                  onKeyDown={(e) => setOpen(e.key !== "Escape")}
                  onMouseDown={() => setOpen((open) => !!search || !open)}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setOpen(false)}
                >
                  <Input placeholder="Search for a song on Spotify..." />
                </CommandPrimitive.Input>
              </PopoverAnchor>
              <PopoverContent
                asChild
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => {
                  if (
                    e.target instanceof Element &&
                    e.target.hasAttribute("cmdk-input")
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-[--radix-popover-trigger-width] p-0"
              >
                <CommandList>
                  {tracks.map((t) => (
                    <CommandItem
                      key={t.spotifyID}
                      value={t.spotifyID}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      <div>
                        {t.name}
                        {t.artist}
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </PopoverContent>
            </Command>
          </Popover>
        </div>
      </div>
    </main>
  );
}
