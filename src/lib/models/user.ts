import mongoose, { type Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
}

export default mongoose.models.User ??
  mongoose.model<IUser>(
    "User",
    new mongoose.Schema<IUser>(
      {
        _id: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
      } as const,
      { _id: false, timestamps: true },
    ),
  );
