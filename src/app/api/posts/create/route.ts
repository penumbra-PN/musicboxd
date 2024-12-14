import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { v4 as uuid } from "uuid";

import { auth } from "@/lib/lucia";
import Post, { type IPost } from "@/lib/models/post";
import User, { type IUser } from "@/lib/models/user";
import { CreatePost } from "@/lib/validators/post";

export const POST = async (request: NextRequest) => {
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

    const validated = CreatePost.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const user = session.user as IUser;

    const exists = (await User.findById(user.id).exec()) as IUser;
    if (!exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const newPost = (await Post.create({
      _id: uuid(),
      user_id: exists._id,
      title: body.title,
      text: body.text,
      likes: [],
      dislikes: [],
      comments: [],
      created_at: new Date(),
      updated_at: "",
    })) as IPost;
    if (!newPost) {
      throw "Error: Could not add post";
    }
    await newPost.save();

    exists.posts.push(newPost._id as string);

    const updateInfo = await User.findByIdAndUpdate(newPost.user_id, {
      $set: exists,
    }).exec();
    if (!updateInfo) {
      throw "Error: Could not update user";
    }
    await updateInfo.save();

    return NextResponse.json(
      {
        success: true,
        post: newPost,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
};
