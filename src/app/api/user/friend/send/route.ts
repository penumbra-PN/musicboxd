import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { auth } from "@/lib/lucia";
import User, { type IUser } from "@/lib/models/user";
import Channel, { type IChannel } from "@/lib/models/channel";

export const POST = async (request: NextRequest) => {
  try {
    const authRequest = auth.handleRequest(request.method, context);

    const session = await authRequest.validate();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
        },
        { status: 403 },
      );
    }

    let sender = session.user as IUser;

    const body = await request.json();
    const { username } = body;

    const receiver = (await User.findOne({
      username: {
        $regex: `^${username}$`,
        $options: "i",
      },
    }).exec()) as IUser;
    if (!receiver) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 },
      );
    }

    if (receiver.username === sender.username) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot friend yourself.",
        },
        { status: 400 },
      );
    }

    if (receiver.friend_requests.includes(sender.id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Already sent friend request.",
        },
        { status: 400 },
      );
    }

    if (receiver.friends.includes(sender.id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Already friends.",
        },
        { status: 400 },
      );
    }

    if (sender.friend_requests.includes(receiver.id)) {
      sender = (await User.findById(sender.id).exec()) as IUser;
      sender.friend_requests.splice(sender.friend_requests.indexOf(receiver.id), 1);
      sender.friends.push(receiver.id);
      receiver.friends.push(sender.id);
      await sender.save();
      await receiver.save();

      const channel = (await Channel.create({
        _id: uuid(),
        userA_id: sender.id,
        userB_id: receiver.id,
      })) as IChannel;

      return NextResponse.json(
        {
          success: true,
          user: receiver,
          channelId: channel.id,
        },
        { status: 200 },
      );
    }

    receiver.friend_requests.push(sender.id);
    await receiver.save();

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
