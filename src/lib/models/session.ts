import mongoose, { type Document } from "mongoose";

export interface ISession extends Document {
  user_id: string;
  active_expires: number;
  idle_expires: number;
}

export default mongoose.models.Session ||
  mongoose.model<ISession>(
    "Session",
    new mongoose.Schema<ISession>(
      {
        _id: { type: String, required: true },
        user_id: { type: String, required: true },
        active_expires: { type: Number, required: true },
        idle_expires: { type: Number, required: true },
      } as const,
      { _id: false },
    ),
  );
