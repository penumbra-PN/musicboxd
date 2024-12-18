"use client";

import React, { useState } from "react";

import Link from "next/link";

export type Song = {
  id: string;
  name: string;
  artists: string[];
  album: string;
  image: string;
  release_date: string | null;
  duration: number | null;
  preview_url: string | null;
};

const SongsSearch = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setSongs([]);

    try {
      const response = await fetch(`/api/spotify/songs?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }
      const data = await response.json();

      for (const song of data.songs) {
        await saveSongToDB(song);
      }

      setSongs(data.songs);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveSongToDB = async (song: Song) => {
    try {
      const response = await fetch("api/spotify/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: song.name,
          artist: song.artists.join(", "),
          album: song.album,
          spotify_id: song.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save song: ${song.name}`);
      }
    } catch (error) {
      console.error(`Error saving song to database: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h1>Search Songs</h1>

      {/* Search Input */}
      <div className="flex gap-x-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter a song name or artist"
          className="border rounded px-4 py-2 w-80"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* Songs List */}
      {songs.length > 0 && (
        <ul>
          {songs.map((song) => (
            <li key={song.id} className="mb-4 flex gap-x-4 items-center">
              <Link href={`/songs/${song.id}`} className="flex items-center gap-x-4">
                <img src={song.image} alt={`${song.name} album cover`} width="50" />
                <div>
                  <strong>{song.name}</strong> by {song.artists.join(", ")}
                  <p>Album: {song.album}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {!loading && !error && songs.length === 0 && <div>No songs found. Try a different search query!</div>}
    </div>
  );
};

export default SongsSearch;
