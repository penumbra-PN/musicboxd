import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import Channel, { type IChannel } from "@/lib/models/channel";
import Comment, { type IComment } from "@/lib/models/comment";
import Message, { type IMessage } from "@/lib/models/message";
import Post, { type IPost } from "@/lib/models/post";
import Review, { type IReview } from "@/lib/models/review";
import Song, { type ISong } from "@/lib/models/song";
import User, { type IUser } from "@/lib/models/user";

export const DELETE = async (request: NextRequest) => {
  try {
    const authRequest = auth.handleRequest(request.method, context);

    const session = await authRequest.validate();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 403 },
      );
    }

    const sessionUser = session.user as IUser;

    const comments = (await Comment.find({
      user_id: sessionUser.id,
    }).exec()) as IComment[];
    await Promise.all(
      comments.map(async (comment) => {
        const post = (await Post.findById(comment.post_id).exec()) as IPost;
        post.comments.splice(post.comments.indexOf(comment.id), 1);
        post.markModified("comments");
        await post.save();

        await Comment.findByIdAndDelete(comment.id).exec();
      }),
    );

    // Cursed sleep cause Mongoose is blowing up with too many saves
    await new Promise((r) => setTimeout(r, 2000));

    const posts = (await Post.find({
      user_id: sessionUser.id,
    }).exec()) as IPost[];
    await Promise.all(
      posts.map(async (post) => {
        const comments = post.comments;
        comments.map(async (id) => {
          const comment = (await Comment.findById(id).exec()) as IComment;
          const sender = (await User.findById(comment.user_id).exec()) as IUser;
          sender.comments.splice(sender.comments.indexOf(id), 1);
          sender.markModified("comments");
          await sender.save();

          await Comment.findByIdAndDelete(id).exec();
        });

        const user = (await User.findById(post.user_id).exec()) as IUser;
        user.posts.splice(user.posts.indexOf(post.id), 1);
        user.markModified("posts");
        await user.save();

        await Post.findByIdAndDelete(post.id).exec();
      }),
    );

    // Cursed sleep cause Mongoose is blowing up with too many saves
    await new Promise((r) => setTimeout(r, 2000));

    const reviews = (await Review.find({
      user_id: sessionUser.id,
    }).exec()) as IReview[];
    await Promise.all(
      reviews.map(async (review) => {
        const song = (await Song.findOne({
          spotify_id: review.song_id,
        }).exec()) as ISong;
        song.reviews.splice(song.reviews.indexOf(review.id), 1);
        song.markModified("reviews");
        await song.save();

        await Review.findByIdAndDelete(review.id).exec();
      }),
    );

    // Cursed sleep cause Mongoose is blowing up with too many saves
    await new Promise((r) => setTimeout(r, 2000));

    const channels = (await Channel.find({
      $or: [{ userA_id: sessionUser.id }, { userB_id: sessionUser.id }],
    })) as IChannel[];
    await Promise.all(
      channels.map(async (channel) => {
        const messages = channel.messages;
        messages.map(async (id) => {
          const message = (await Message.findById(id).exec()) as IMessage;
          const sender = (await User.findById(message.user_id).exec()) as IUser;
          sender.messages.splice(sender.messages.indexOf(id), 1);
          sender.markModified("messages");
          await sender.save();

          await Message.findByIdAndDelete(id).exec();
        });

        await Channel.findByIdAndDelete(channel.id).exec();
      }),
    );

    // Cursed sleep cause Mongoose is blowing up with too many saves
    await new Promise((r) => setTimeout(r, 2000));

    const friends = (await User.find({
      friends: {
        $in: sessionUser.id,
      },
    })) as IUser[];
    await Promise.all(
      friends.map(async (friend) => {
        friend.friends.splice(friend.friends.indexOf(sessionUser.id), 1);
        friend.markModified("friends");
        await friend.save();
      }),
    );

    // Cursed sleep cause Mongoose is blowing up with too many saves
    await new Promise((r) => setTimeout(r, 2000));

    const friendRequested = (await User.find({
      friend_requests: {
        $in: sessionUser.id,
      },
    })) as IUser[];
    await Promise.all(
      friendRequested.map(async (user) => {
        user.friend_requests.splice(user.friend_requests.indexOf(sessionUser.id), 1);
        user.markModified("friend_requests");
        await user.save();
      }),
    );

    await auth.deleteUser(sessionUser.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
