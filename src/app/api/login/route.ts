import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { LuciaError } from "lucia";

import { auth, ErrorMessage } from "@/lib/lucia";
import { UserLogin } from "@/lib/validators/user";
import User from "@/lib/models/user";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validated = UserLogin.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: validated.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = body;

    const exists = await User.findOne({ email: email });
    if (!exists) {
      return NextResponse.json(
        {
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

    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);

    return new Response(null, { status: 200 });
  } catch (error) {
    console.log(error);
    if (
      error instanceof LuciaError &&
      (error.message === ErrorMessage.INVALID_KEY_ID || error.message === ErrorMessage.INVALID_PASSWORD)
    ) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
};
