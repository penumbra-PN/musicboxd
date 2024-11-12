import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { LuciaError } from "lucia";

import { auth, ErrorMessage } from "@/lib/lucia";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    const key = await auth.useKey("email", email.toLowerCase(), password);

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);

    return new Response(null, { status: 200 });
  } catch (error) {
    if (
      error instanceof LuciaError &&
      (error.message === ErrorMessage.INVALID_KEY_ID || error.message === ErrorMessage.INVALID_PASSWORD)
    ) {
      return NextResponse.json({ message: "Incorrect username or password." }, { status: 403 });
    }
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
};
