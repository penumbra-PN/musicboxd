import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import User, { IUser } from "@/lib/models/user";

export const DELETE = async (request: NextRequest) => {
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
    await receiver.save();

    return NextResponse.json(
      {
        success: true,
        user: sender,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
