import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import User, { type IUser } from "@/lib/models/user";
import { EditProfile } from "@/lib/validators/user";

export const PATCH = async (request: NextRequest) => {
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

    const body = await request.json();

    const validated = EditProfile.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const user = session.user as IUser;

    const exists = await User.findOne({
      username: {
        $regex: `^${body.username}$`,
        $options: "i",
      },
    });
    if (exists && user.id !== exists.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Username already taken.",
        },
        { status: 400 },
      );
    }

    await User.findByIdAndUpdate(user.id, {
      $set: body,
    }).exec();

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
