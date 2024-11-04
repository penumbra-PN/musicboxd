import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { LuciaError } from "lucia";

import { auth } from "@/lib/lucia";

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

    return new Response(JSON.stringify({ message: "Successfully logged in." }), { status: 200 });
  } catch (error) {
    if (
      error instanceof LuciaError &&
      (error.message === "AUTH_INVALID_KEY_ID" || error.message === "AUTH_INVALID_PASSWORD")
    ) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 403 });
    }

    return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  }
};
