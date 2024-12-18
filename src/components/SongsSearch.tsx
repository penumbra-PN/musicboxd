"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const SongsSearch= () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      
      for(const song of data.songs){
        await saveSongToDB(song);
      }
      
      setSongs(data.songs);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSongToDB = async (song) => {
    try{
      const response = await fetch("api/spotify/songs", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: song.name,
          artist: song.artists.join(", "),
          album: song.album,
          spotify_id: song.id,
        })
      });

      if(!response.ok){
        throw new Error(`Failed to save song: ${song.name}`);
      }
    }catch (err){
      console.error(`Error saving song to database: ${err.message}`);
    }
  }

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
          className="placeholder-gray-600 rounded px-4 py-2 w-80 bg-textbox-gray text-spotify-black"
        />
        <button
          onClick={handleSearch}
          className="bg-spotify-green text-spotify-black font-bold px-4 py-2 rounded-3xl hover:bg-spotify-white"
        >
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
                <div className="hover:underline">
                  <strong className="text-spotify-green">{song.name}</strong> by {song.artists.join(", ")}
                  <p>Album: {song.album}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {!loading && !error && songs.length === 0 && (
        <div>No songs found. Try a different search query!</div>
      )}
    </div>
  );
};

export default SongsSearch;