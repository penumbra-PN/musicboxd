import { NextRequest, NextResponse } from "next/server";

import User from "@/lib/models/user";

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const id = (await params).id;
    const body = await req.json();

    await User.findByIdAndUpdate(id, {
      $set: body,
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
};
