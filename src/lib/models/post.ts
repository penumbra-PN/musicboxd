import mongoose, { type Document } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IPost extends Document {
  user_id: string;
  title: string;
  text: string;
  likes: number;
  dislikes: number;
  comments: string[];
  created_at: string;
  updated_at: string;
}

export default mongoose.models.Post ||
  mongoose.model<IPost>(
    "Post",
    new mongoose.Schema<IPost>(
      {
        _id: { type: String, required: true, default: uuid() },
        user_id: { type: String, required: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
        likes: { type: Number, required: true, default: 0 },
        dislikes: { type: Number, required: true, default: 0 },
        comments: { type: [String], required: true, default: [] },
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
