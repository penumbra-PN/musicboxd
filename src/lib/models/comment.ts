import mongoose, { type Document } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IComment extends Document {
  post_id: string;
  user_id: string;
  text: string;
  likes: string[];
  dislikes: string[];
  created_at: string;
  updated_at: string;
}

export default mongoose.models.Comment ||
  mongoose.model<IComment>(
    "Comment",
    new mongoose.Schema<IComment>(
      {
        _id: { type: String, required: true, default: uuid() },
        post_id: { type: String, required: true },
        user_id: { type: String, required: true },
        text: { type: String, required: true },
        likes: { type: [String], required: true, default: [] },
        dislikes: { type: [String], required: true, default: [] },
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
