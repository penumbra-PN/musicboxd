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

    const posts = (await Post.find().exec()) as IPost[];

    if (!posts) {
      return NextResponse.json(
        {
          success: false,
          message: "No posts found",
        },
        { status: 404 },
      );
    } else {
      return NextResponse.json({ posts }, { status: 200 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, e: "Internal server error." }, { status: 500 });
  }
};

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    try {
      const post = (await Post.findById(body.postId).exec()) as IPost;
      if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }

      if (body.liked) {
        if (post.dislikes.includes(session.user.id as string)) {
          post.dislikes = post.dislikes.filter((id: string) => id !== session.user.id);
          post.likes.push(session.user.id as string);
        } else if (post.likes.includes(session.user.id as string)) {
          post.likes = post.likes.filter((id: string) => id !== session.user.id);
        } else {
          post.likes.push(session.user.id as string);
        }
      } else if (body.disliked) {
        if (post.likes.includes(session.user.id as string)) {
          post.likes = post.likes.filter((id: string) => id !== session.user.id);
          post.dislikes.push(session.user.id as string);
        } else if (post.dislikes.includes(session.user.id as string)) {
          post.dislikes = post.dislikes.filter((id: string) => id !== session.user.id);
        } else {
          post.dislikes.push(session.user.id as string);
        }
      }
      let removed: string[] = [];
      post.likes.forEach((id) => {
        if (!removed.includes(id)) {
          removed.push(id);
        }
      });
      post.likes = removed;

      removed = [];
      post.dislikes.forEach((id) => {
        if (!removed.includes(id)) {
          removed.push(id);
        }
      });
      post.dislikes = removed;

      await Post.findByIdAndUpdate(post._id, {
        $set: post,
      }).exec();
      await post.save();

      return NextResponse.json({ success: true, post }, { status: 200 });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ success: false, error: e }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
