import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import { UserSignup } from "@/lib/validators/user";
import User from "@/lib/models/user";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validated = UserSignup.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: validated.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const { email, username, password } = body;

    const exists = (await User.findOne({ email: email })) || (await User.findOne({ username: username }));
    if (exists) {
      return NextResponse.json(
        {
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

    const authRequest = auth.handleRequest(req.method, context);
    authRequest.setSession(session);

    return NextResponse.json(null, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
};
