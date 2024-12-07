import { revalidatePath } from "next/cache";
import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";

export const DELETE = async (request: NextRequest) => {
  try {
    const authRequest = auth.handleRequest(request.method, context);

    const session = await authRequest.validate();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 403 },
      );
    }

    await auth.invalidateSession(session.sessionId);

    authRequest.setSession(null);

    revalidatePath("/");

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
