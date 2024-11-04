import mongoose, { type Document } from "mongoose";

export interface IReview extends Document {
  user_id: string;
  text: string;
  rating: number;
}

export default mongoose.models.Review ??
  mongoose.model<IReview>(
    "Review",
    new mongoose.Schema<IReview>(
      {
        _id: { type: String, required: true, unique: true },
        user_id: { type: String, required: true },
        text: { type: String, required: true },
        rating: { type: Number, required: true },
      } as const,
      { _id: false, timestamps: true },
    ),
  );
