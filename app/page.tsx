"use client";

import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseTrack } from "@/lib/utils";
import { Track } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["SpotifySearch", search],
    queryFn: async () => {
      if (search && search !== "") {
        const results = await axios.post("/api/search", {
          search,
        });
        return results.data;
      }

      return null;
    },
  });

  const tracks: Track[] = useMemo(
    () => data?.tracks?.items?.map(parseTrack) || [],
    [data]
  );

  function onSelectItem(spotifyid: string) {
    setOpen(false);
    router.push(`/track/${spotifyid}`);
  }

  return (
    <div className="h-full flex flex-col justify-evenly">
      <div>
        <div className="flex justify-center text-3xl mb-4">Search</div>
        <div className="w-[90%] max-w-[500px] mx-auto">
          <Popover open={open} onOpenChange={setOpen}>
            <Command shouldFilter={false}>
              <PopoverAnchor asChild>
                <CommandPrimitive.Input
                  className="box-border"
                  asChild
                  value={search}
                  onValueChange={setSearch}
                  onKeyDown={(e) => setOpen(e.key !== "Escape")}
                  onMouseDown={() => setOpen((open) => !!search || !open)}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setOpen(false)}
                >
                  <Input
                    placeholder="Search for a song on Spotify..."
                    className="dark:bg-gray-950 dark:text-white"
                  />
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
                  {isPending && (
                    <CommandPrimitive.Loading>
                      <div className="p-1">
                        <Skeleton className="h-6 w-full" />
                      </div>
                    </CommandPrimitive.Loading>
                  )}
                  {!isPending && tracks?.length > 0
                    ? tracks?.map((t) => (
                        <CommandItem
                          key={t.spotifyid}
                          value={t.spotifyid}
                          onMouseDown={(e) => e.preventDefault()}
                          onSelect={onSelectItem}
                        >
                          <div className="flex gap-2">
                            <img
                              src={t.imageUrl}
                              alt="album-art"
                              className="h-20 w-20"
                            />
                            <div className="flex flex-col justify-center">
                              <div>{t.artist}</div>
                              <div className="text-2xl font-bold">{t.name}</div>
                              <div className="text-xs italic">{t.album}</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))
                    : null}
                  {!isPending ? (
                    <CommandEmpty>{"No items."}</CommandEmpty>
                  ) : null}
                </CommandList>
              </PopoverContent>
            </Command>
          </Popover>
        </div>
      </div>
      <div className="max-w-[500px] mx-auto p-4 text-center mb-20">
        IsThisACover uses OpenAI in combination with user votes to determine if
        a song in Spotify&apos;s database is an original or a cover. Search for
        a song to get started!
      </div>
    </div>
  );
}
