import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/lucia";
import Post, { type IPost } from "@/lib/models/post";


export const GET = async (request: NextRequest) => {
  try {
    const authRequest = auth.handleRequest(request.method, context);

    const session = await authRequest.validate();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
        },
        { status: 403 },
      );
    }

    const posts = await Post.find().exec() as IPost[];

    if (!posts) {
      return NextResponse.json(
        { 
          sucess: false,
          message: "No posts found" 
        }, 
        { status: 404 });
    } else {
        return NextResponse.json({posts}, {status: 200 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, e: "Internal server error." }, { status: 500 });
  }
}