"use client";
import { v4 as uuidv4 } from "uuid";
import { useSpotifyPlaylist } from "@/app/hooks/useSpotifyPlaylist";
import * as React from "react";
import SearchBar from "./SearchBar";
import TableRow from "./TableRow";
import { useInView } from "react-intersection-observer";
import { useIntersection } from "@mantine/hooks";
import { Button } from "./ui/button";

export default function PlaylistTable() {
  const { data, size, setSize, error, isLoading } = useSpotifyPlaylist();
  const [search, setSearch] = React.useState<string>("");

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Failed to load</div>;

  console.log({ data });

  const renderSongs = data.items
    .filter((item) => {
      const track = item.track!;
      const loweredCased = search.toLowerCase();
      return !loweredCased ? track : track.name.toLowerCase().includes(loweredCased);
    })
    .map((item, index) => (
      <tr key={uuidv4()} className="bg-black border-t border-gray-800 hover:bg-gray-800 text-white">
        <TableRow track={item.track!} />
      </tr>
    ));

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md flex-col text-center">
        <div className="flex items-center justify-between py-4 bg-black dark:bg-gray-800 p-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <svg
                className="w-4 h-4 text-white "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <SearchBar setSearch={setSearch} search={search} />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-black">
            <tr>
              <th scope="col" className="px-20 py-3">
                Song
              </th>
              <th scope="col" className="px-6 py-3">
                Artist
              </th>
              <th scope="col" className="px-6 py-3">
                Album
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
            </tr>
          </thead>
          <tbody>{renderSongs}</tbody>
        </table>
        {data.next ? (
          <Button variant="ghostW" className="text-white justify-center" onClick={() => setSize(size + 1)}>
            Load More
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
