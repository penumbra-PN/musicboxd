import mongoose, { type Document } from "mongoose";
import { v4 as uuid } from "uuid";

export interface ISong extends Document {
  name: string;
  artist: string;
  album: string;
  spotify_id: string;
  reviews: string[];
  created_at: string;
  updated_at: string;
}

export default mongoose.models.Song ||
  mongoose.model<ISong>(
    "Song",
    new mongoose.Schema<ISong>(
      {
        _id: { type: String, required: true, default: uuid() },
        name: { type: String, required: true },
        artist: { type: String, required: true },
        album: { type: String, required: true },
        spotify_id: { type: String, required: true, unique: true },
        reviews: { type: [String], required: true, default: [] },
      } as const,
      {
        _id: false,
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at",
        },
      },
    ),
  );
