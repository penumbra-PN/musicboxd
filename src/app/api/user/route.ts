import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import Channel, { type IChannel } from "@/lib/models/channel";
import Comment from "@/lib/models/comment";
import Message from "@/lib/models/message";
import Post, { IPost } from "@/lib/models/post";
import Review from "@/lib/models/review";
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

    const posts = (await Post.find({
      user_id: sessionUser.id,
    }).exec()) as IPost[];
    await Promise.all(
      posts.map(async (post) => {
        const comments = post.comments;
        comments.map(async (id) => {
          await Comment.findByIdAndDelete(id).exec();
        });

        await Post.findByIdAndDelete(post.id).exec();
      }),
    );

    await Review.deleteMany({
      user_id: sessionUser.id,
    }).exec();

    const channels = (await Channel.find({
      $or: [{ userA_id: sessionUser.id }, { userB_id: sessionUser.id }],
    })) as IChannel[];
    await Promise.all(
      channels.map(async (channel) => {
        const messages = channel.messages;
        messages.map(async (id) => {
          await Message.findByIdAndDelete(id).exec();
        });

        await Channel.findByIdAndDelete(channel.id).exec();
      }),
    );

    const friended = (await User.find({
      friends: {
        $in: sessionUser.id,
      },
    })) as IUser[];
    await Promise.all(
      friended.map(async (user) => {
        user.friends.splice(user.friends.indexOf(sessionUser.id), 1);
        await user.save();
      }),
    );

    const friendRequested = (await User.find({
      friend_requests: {
        $in: sessionUser.id,
      },
    })) as IUser[];
    await Promise.all(
      friendRequested.map(async (user) => {
        user.friend_requests.splice(user.friend_requests.indexOf(sessionUser.id), 1);
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
