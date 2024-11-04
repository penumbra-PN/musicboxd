import mongoose, { type Document } from "mongoose";

export interface IKey extends Document {
  user_id: string;
  hashed_password: string;
}

export default mongoose.models.Key ??
  mongoose.model(
    "Key",
    new mongoose.Schema<IKey>(
      {
        _id: { type: String, required: true },
        user_id: { type: String, required: true },
        hashed_password: { type: String, required: true },
      } as const,
      { _id: false },
    ),
  );
