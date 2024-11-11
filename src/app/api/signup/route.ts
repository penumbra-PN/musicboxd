import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: email.toLowerCase(),
        password,
      },
      attributes: {
        email,
        username,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);

    return new Response(JSON.stringify({ message: "Successfully created user." }), { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  }
};
