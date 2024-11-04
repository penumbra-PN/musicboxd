import mongoose, { type Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  friends: string[];
  friend_requests: string[];
  reviews: string[];
  posts: string[];
  comments: string[];
  recently_listened: string[];
  private_messages: string[];
  messages: string[];
}

export default mongoose.models.User ??
  mongoose.model<IUser>(
    "User",
    new mongoose.Schema<IUser>(
      {
        _id: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        friends: { type: [String], required: true, default: [] },
        friend_requests: { type: [String], required: true, default: [] },
        reviews: { type: [String], required: true, default: [] },
        posts: { type: [String], required: true, default: [] },
        comments: { type: [String], required: true, default: [] },
        recently_listened: { type: [String], required: true, default: [] },
        private_messages: { type: [String], required: true, default: [] },
        messages: { type: [String], required: true, default: [] },
      } as const,
      { _id: false, timestamps: true },
    ),
  );
