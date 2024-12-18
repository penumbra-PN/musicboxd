import { NextResponse } from "next/server";

// import mongoose from "mongoose";
import Review from "@/lib/models/review";
import Song, { type ISong } from "@/lib/models/song";
import User from "@/lib/models/user";

// const connectDB = async () => {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }
// };

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    // Connect to MongoDB
    // await connectDB();

    // Find the song by Spotify ID
    const song = (await Song.findOne({ spotify_id: params.id }).exec()) as ISong;
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Fetch reviews for the song
    const reviews = await Promise.all(
      song.reviews.map(async (reviewId) => {
        const review = await Review.findById(reviewId).exec();
        if (!review) return null;

        const user = await User.findById(review.user_id).exec();
        return {
          id: review._id,
          text: review.text,
          rating: review.rating,
          created_at: review.created_at,
          user: user ? { id: user._id, name: user.name, email: user.email } : { id: null, name: "Unknown User" },
        };
      }),
    );

    return NextResponse.json({ song, reviews: reviews });
  } catch (error) {
    console.error("Error fetching song details:", error);
    return NextResponse.json({ error: "Failed to fetch song details" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const { song_id, user_id, text, rating } = await request.json();

    if (!song_id || !user_id || !text || rating == null) {
      return NextResponse.json({ error: "Missing required fields: songId, userId, text, or rating" }, { status: 400 });
    }

    if (text.length > 250) {
      return NextResponse.json({ error: "Review text cannot exceed 250 characters" }, { status: 400 });
    }

    if (rating < 0 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 0 and 5" }, { status: 400 });
    }

    // await connectDB();

    const newReview = new Review({
      _id: new mongoose.Types.ObjectId().toString(),
      song_id,
      user_id,
      text,
      rating,
    });

    await newReview.save();

    const updatedSong = await Song.findOneAndUpdate(
      { spotify_id: song_id },
      { $push: { reviews: newReview._id } },
      { new: true },
    );

    const updatedUser = await User.findByIdAndUpdate(user_id, { $push: { reviews: newReview._id } }, { new: true });

    if (!updatedSong || !updatedUser) {
      throw new Error("Failed to update user or song with the new review.");
    }

    return NextResponse.json({
      success: true,
      review: newReview,
      updatedSong,
      updatedUser,
    });
  } catch (error) {
    console.error("Error saving review:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
};
