import mongoose, { type Document } from "mongoose";

export interface IMessage extends Document {
  user_id: string;
  text: string;
}

export default mongoose.models.Message ??
  mongoose.model<IMessage>(
    "Message",
    new mongoose.Schema<IMessage>(
      {
        _id: { type: String, required: true, unique: true },
        user_id: { type: String, required: true },
        text: { type: String, required: true },
      } as const,
      { _id: false, timestamps: true },
    ),
  );
