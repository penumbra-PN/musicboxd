import { revalidatePath } from "next/cache";
import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";

export const DELETE = async (request: NextRequest) => {
  try {
    const authRequest = auth.handleRequest(request.method, context);

    const session = await authRequest.validate();
    if (!session) {
      return new Response(null, { status: 401 });
    }

    await auth.invalidateSession(session.sessionId);

    authRequest.setSession(null);

    revalidatePath("/");

    return new Response(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
};
