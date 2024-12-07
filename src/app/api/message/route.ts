import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { v4 as uuid } from "uuid";

import { auth } from "@/lib/lucia";
import Channel, { type IChannel } from "@/lib/models/channel";
import Message, { type IMessage } from "@/lib/models/message";
import User, { type IUser } from "@/lib/models/user";
import { SendMessage } from "@/lib/validators/user";

export const POST = async (request: NextRequest) => {
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

    const body = await request.json();

    const validated = SendMessage.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const { channelId, userId, text } = body;

    const channel = (await Channel.findById(channelId).exec()) as IChannel;
    if (!channel) {
      return NextResponse.json(
        {
          success: false,
          error: "Channel not found.",
        },
        { status: 404 },
      );
    }

    const user = (await User.findById(userId).exec()) as IUser;
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 },
      );
    }

    if (user.id !== sessionUser.id) {
      return NextResponse.json(
        {
          success: false,
        },
        { status: 403 },
      );
    }

    const message = (await Message.create({
      _id: uuid(),
      channel_id: channel.id,
      user_id: user.id,
      text: text,
    })) as IMessage;

    channel.messages.push(message.id);
    await channel.save();

    user.messages.push(message.id);
    await user.save();

    return NextResponse.json(
      {
        message: message,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
