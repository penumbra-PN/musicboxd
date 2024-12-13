"use client";

import React, {useState, useEffect} from 'react';

const SongPage = ({id, session}: {id:string, session: any})=>{
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchSongDetails = async () =>{
            try {
                const response = await fetch(`/api/spotify/songs/${id}`);
                if(!response.ok){
                    throw new Error("Failed to fetch song details");
                }
                const data = await response.json();
                setSong(data.song);
            } catch (err){
                setError(err.message);
            } finally{
                setLoading(false);
            }
        };
        if (session){
            fetchSongDetails();
        }
    }, [id, session]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <main className="flex min-h-screen w-screen flex-col items-center p-8">
        <h1 className="text-4xl font-bold">{song.name}</h1>
        <img src={song.image} alt={`${song.name} album cover`} className="w-64 h-64 my-4" />
        <p>
            <strong>Artists:</strong> {song.artists.join(", ")}
        </p>
        <p>
            <strong>Album:</strong> {song.album}
        </p>
        <p>
            <strong>Release Date:</strong> {song.release_date}
        </p>
        {song.preview_url ? (
            <audio controls className="mt-4">
            <source src={song.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
            </audio>
        ) : (
            <p>No preview available.</p>
        )}
        </main>
    );
};

export default SongPage;