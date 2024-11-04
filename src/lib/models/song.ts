import mongoose, { type Document } from "mongoose";

export interface ISong extends Document {
  name: string;
  artist: string;
  album: string;
  spotify_id: string;
  reviews: string[];
}

export default mongoose.models.Song ??
  mongoose.model<ISong>(
    "Song",
    new mongoose.Schema<ISong>(
      {
        _id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        artist: { type: String, required: true },
        album: { type: String, required: true },
        spotify_id: { type: String, required: true, unique: true },
        reviews: { type: [String], required: true, default: [] },
      } as const,
      { _id: false },
    ),
  );
