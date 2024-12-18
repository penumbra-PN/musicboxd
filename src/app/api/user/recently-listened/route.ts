import { NextResponse } from "next/server";

import dotenv from "dotenv";

// import mongoose from "mongoose";
import Song from "@/lib/models/song";
import User from "@/lib/models/user";

dotenv.config();

// const connectToDatabase = async () => {
//   if (!mongoose.connection.readyState) {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }
// };

export const POST = async (request: Request) => {
  try {
    // await connectToDatabase();

    const { userId, song } = await request.json();

    if (!userId || !song) {
      return NextResponse.json({ error: "Missing userId or song in request body" }, { status: 400 });
    }

    let dbSong = await Song.findOne({ spotify_id: song.id });
    if (!dbSong) {
      dbSong = new Song({
        name: song.name,
        artists: song.artists,
        album: song.album,
        release_date: song.release_date,
        spotify_id: song.id,
        image: song.image,
        preview_url: song.preview_url,
      });
      await dbSong.save();
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyInList = user.recently_listened.includes(dbSong.spotify_id);

    if (!alreadyInList) {
      user.recently_listened.unshift(dbSong.id);
      if (user.recently_listened.length > 20) {
        user.recently_listened.pop();
      }
      await user.save();
    }

    return NextResponse.json({ message: "Song added to recently listened" });
  } catch (error) {
    console.error("Error adding to recently listened:", error);
    return NextResponse.json({ error: "Failed to add to recently listened" }, { status: 500 });
  }
};

export const GET = async (request: Request) => {
  try {
    // await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in query parameters" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const songs = await Song.find({ spotify_id: { $in: user.recently_listened } });

    return NextResponse.json({ recently_listened: songs });
  } catch (error) {
    console.error("Error retrieving recently listened songs:", error);
    return NextResponse.json({ error: "Failed to retrieve recently listened songs" }, { status: 500 });
  }
};
