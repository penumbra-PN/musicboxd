import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import { Signup } from "@/lib/validators/user";
import User from "@/lib/models/user";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const validated = Signup.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const { email, username, password } = body;

    const exists =
      (await User.findOne({ email: email }).exec()) ||
      (await User.findOne({
        username: {
          $regex: `^${username}$`,
          $options: "i",
        },
      }).exec());
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists.",
        },
        { status: 400 },
      );
    }

    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: email.toLowerCase(),
        password,
      },
      attributes: {
        email: email,
        username: username,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);

    return NextResponse.json(
      {
        success: true,
        id: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
