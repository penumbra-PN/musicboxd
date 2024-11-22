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

    let receiver = session.user as IUser;

    const body = await request.json();
    const { senderId } = body;

    const sender = (await User.findById(senderId).exec()) as IUser;
    if (!sender) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 },
      );
    }

    if (!receiver.friend_requests.includes(sender.id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Friend request not found.",
        },
        { status: 404 },
      );
    }

    receiver = (await User.findById(receiver.id).exec()) as IUser;
    receiver.friend_requests.splice(receiver.friend_requests.indexOf(sender.id), 1);
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
        user: sender,
        channelId: channel.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
