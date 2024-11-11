import mongoose, { type Document } from "mongoose";

export interface IReview extends Document {
  song_id: string;
  user_id: string;
  text: string;
  rating: number;
}

export default mongoose.models.Review ??
  mongoose.model<IReview>(
    "Review",
    new mongoose.Schema<IReview>(
      {
        _id: { type: String, required: true },
        song_id: { type: String, required: true },
        user_id: { type: String, required: true },
        text: { type: String, required: true },
        rating: { type: Number, required: true },
      } as const,
      { _id: false, timestamps: true },
    ),
  );
