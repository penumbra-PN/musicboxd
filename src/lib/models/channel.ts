import mongoose, { type Document } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IChannel extends Document {
  userA_id: string;
  userB_id: string;
  messages: string[];
}

export default mongoose.models.Channel ||
  mongoose.model<IChannel>(
    "Channel",
    new mongoose.Schema<IChannel>(
      {
        _id: { type: String, required: true, default: uuid() },
        userA_id: { type: String, required: true },
        userB_id: { type: String, required: true },
        messages: { type: [String], default: [] },
      } as const,
      { _id: false, timestamps: true },
    ),
  );
