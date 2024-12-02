import mongoose, { type Document } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IMessage extends Document {
  channel_id: string;
  user_id: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export default mongoose.models.Message ||
  mongoose.model<IMessage>(
    "Message",
    new mongoose.Schema<IMessage>(
      {
        _id: { type: String, required: true, default: uuid() },
        channel_id: { type: String, required: true },
        user_id: { type: String, required: true },
        text: { type: String, required: true },
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
