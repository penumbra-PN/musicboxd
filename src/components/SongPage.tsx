"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const SongPage = ({ id, session }: { id: string; session: any }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addToRecentlyListenedError, setAddToRecentlyListenedError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: "", rating: 0 });
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await fetch(`/api/spotify/songs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch song details");
        }
        const data = await response.json();

        setSong(data.song);
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchSongDetails();
    }
  }, [id, session]);

  const handleReviewSubmit = async () => {
    if (!session) {
      setReviewError("You must be logged in to submit a review.");
      return;
    }
    if (newReview.text.length > 250 || newReview.text.trim() === "") {
      setReviewError("Review text must be between 1 and 250 characters.");
      return;
    }
    if (newReview.rating < 0 || newReview.rating > 5 || newReview.rating % 0.5 !== 0) {
      setReviewError("Rating must be a whole or half number between 0 and 5.");
      return;
    }

    try {
      setReviewError(null);

      const response = await fetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.user.id,
          song_id: id,
          text: newReview.text,
          rating: newReview.rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review.");
      }

      const { review, updatedSong } = await response.json();

      setReviews((prevReviews) => [...prevReviews, review]);
      setNewReview({ text: "", rating: 0 });
    } catch (err) {
      setReviewError(err.message);
    }
  };

  const handleAddToRecentlyListened = async () => {
    if (!session) {
      setAddToRecentlyListenedError("You must be logged in to add to recently listened.");
      return;
    }

    try {
      setAddToRecentlyListenedError(null);

      const response = await fetch("/api/user/recently-listened", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          song: {
            id: song.id,
            name: song.name,
            artists: song.artists,
            album: song.album,
            release_date: song.release_date,
            image: song.image,
            preview_url: song.preview_url,
          },
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to add song to recently listened.");
      }

      alert("Song added to your recently listened list!");
    } catch (err) {
      setAddToRecentlyListenedError(err.message);
    }
  };

  if (loading) return <div className="bg-spotify-black text-spotify-white">Loading...</div>;
  if (error) return <div className="bg-spotify-black text-red-600">Error: {error}</div>;

  return (
    <main className="flex min-h-screen w-screen flex-col items-center p-8 bg-spotify-black text-spotify-white">
      <Link className="absolute top-0 left-0 p-4 hover:text-spotify-green hover:underline" href="/songs">Back</Link>
      <h1 className="text-4xl font-bold text-spotify-green">{song.name}</h1>
      <img src={song.image} alt={`${song.name} album cover`} className="w-64 h-64 my-4" />
      <p>
        <strong className="text-spotify-green">Artists:</strong> {song.artists.join(", ")}
      </p>
      <p>
        <strong className="text-spotify-green">Album:</strong> {song.album}
      </p>
      <p>
        <strong className="text-spotify-green">Release Date:</strong> {song.release_date}
      </p>
      {song.preview_url ? (
        <audio controls className="mt-4">
          <source src={song.preview_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No preview available.</p>
      )}
      <button
        onClick={handleAddToRecentlyListened}
        className="mt-4 px-4 py-2 bg-spotify-green text-spotify-black rounded-3xl font-bold hover:bg-spotify-white"
      >
        Add to Recently Listened
      </button>
      {addToRecentlyListenedError && (
        <p className="text-red-500 mt-2">{addToRecentlyListenedError}</p>
      )}
      <h2 className="mt-8 text-2xl text-spotify-green font-bold">Reviews</h2>
      <div className="flex flex-row w-full max-w-2xl items-center justify-center">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b py-4">
              <p>
                <strong className="text-spotify-green">{review.user?.name || "Unknown User"}</strong> ({review.rating}/5): {review.text}
              </p>
            </div>
          ))
        ) : (
          <p><br></br>No reviews yet. Be the first to leave a review!</p>
        )}
      </div>
      {session && (
        <div className="flex flex-col items-center justify-center mt-6 w-1/4 max-w-2xl relative">
          <h3 className="text-xl font-bold self-center justify-center text-spotify-green">Leave a Review</h3>
          <textarea
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            placeholder="Write your review (max 250 characters)"
            className="w-full p-2 rounded mt-2 bg-textbox-gray text-spotify-black placeholder-gray-600"
            maxLength={250}
          />
          <br></br>
          <div className="mt-2">
            <label htmlFor="rating" className="mr-2">
              Rating:
            </label>
            <input
              type="number"
              id="rating"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
              min="0"
              max="5"
              step="0.5"
              className="w-16 p-1 rounded bg-textbox-gray text-spotify-black"
            />
          </div>
          <br></br>
          <button
            onClick={handleReviewSubmit}
            className="mt-4 px-4 py-2 bg-spotify-green text-spotify-black font-bold rounded-3xl hover:bg-spotify-white"
          >
            Submit Review
          </button>
          {reviewError && <p className="text-red-500 mt-2">{reviewError}</p>}
        </div>
      )}
    </main>
  );
};

export default SongPage;
