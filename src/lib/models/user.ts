import mongoose, { type Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  bio: string;
  friends: string[];
  friend_requests: string[];
  reviews: string[];
  posts: string[];
  comments: string[];
  recently_listened: string[];
  messages: string[];
  created_at: string;
  updated_at: string;
}

export default mongoose.models.User ||
  mongoose.model<IUser>(
    "User",
    new mongoose.Schema<IUser>(
      {
        _id: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        bio: { type: String, default: "" },
        friends: { type: [String], required: true, default: [] },
        friend_requests: { type: [String], required: true, default: [] },
        reviews: { type: [String], required: true, default: [] },
        posts: { type: [String], required: true, default: [] },
        comments: { type: [String], required: true, default: [] },
        recently_listened: { type: [String], required: true, default: [] },
        messages: { type: [String], required: true, default: [] },
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
