import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { LuciaError } from "lucia";

import { auth, ErrorMessage } from "@/lib/lucia";
import { Login } from "@/lib/validators/user";
import User from "@/lib/models/user";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const validated = Login.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = body;

    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User does not exist.",
        },
        { status: 404 },
      );
    }

    const key = await auth.useKey("email", email.toLowerCase(), password);

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);

    return NextResponse.json(
      {
        success: true,
        id: user.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (
      error instanceof LuciaError &&
      (error.message === ErrorMessage.INVALID_KEY_ID || error.message === ErrorMessage.INVALID_PASSWORD)
    ) {
      return NextResponse.json({ success: false, error: "Incorrect username or password." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
