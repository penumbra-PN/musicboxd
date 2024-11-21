import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import User, { type IUser } from "@/lib/models/user";

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

    let user = session.user as IUser;

    const body = await request.json();
    const { friendId } = body;

    const friend = (await User.findById(friendId).exec()) as IUser;
    if (!friend) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 },
      );
    }

    if (!user.friends.includes(friend.id) || !friend.friends.includes(user.id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Friend not found.",
        },
        { status: 404 },
      );
    }

    user = (await User.findById(user.id).exec()) as IUser;
    user.friends.splice(user.friends.indexOf(friend.id), 1);
    friend.friends.splice(friend.friends.indexOf(user.id), 1);
    await user.save();
    await friend.save();

    return NextResponse.json(
      {
        success: true,
        user: friend,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
