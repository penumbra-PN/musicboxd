import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/lucia";
import Comment, { type IComment } from "@/lib/models/comment";
import Post, { type IPost } from "@/lib/models/post";
import User, { type IUser } from "@/lib/models/user";
import { v4 as uuid } from "uuid";

import { CreateComment } from "@/lib/validators/comment";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    try {
      const post = (await Post.findById(params.id).exec()) as IPost;
      return NextResponse.json({ success: true, post }, { status: 200 });
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    try {
      const post = (await Post.findById(params.id).exec()) as IPost;
      if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }
      const body = await request.json();

      if (body.text) {        
        const validated = CreateComment.safeParse(body);
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

        const newComment = (await Comment.create({
          _id: uuid(),
          post_id: post._id,
          user_id: exists._id,
          text: body.text,
          likes: [],
          dislikes: [],
          created_at: new Date(),
          updated_at: ""
        })) as IComment;
        if (!newComment) {
          throw 'Error: Could not add comment';
        }
        await newComment.save();

        exists.comments.push(newComment._id as string);
        let updateInfo = await User.findByIdAndUpdate(newComment.user_id, {
          $set: exists,
        }).exec();
        if (!updateInfo) {
          throw 'Error: Could not update user';
        }
        await updateInfo.save();

        post.comments.push(newComment._id as string);
        updateInfo = await Post.findByIdAndUpdate(newComment.post_id, {
          $set: post,
        }).exec();
        if (!updateInfo) {
          throw 'Error: Could not update post';
        }
        return NextResponse.json(
          {
            success: true,
            post: post,
            comment: newComment,
            commentUsername: exists.username
          },
          { status: 200 },
        )
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

      let comment;
      if (body.commentId) {
        comment = (await Comment.findById(body.commentId).exec()) as IComment;

        if (!comment) {
          return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        }

        if (body.commentLiked) {
          if (comment.dislikes.includes(session.user.id as string)) {
            comment.dislikes = comment.dislikes.filter((id: string) => id !== session.user.id);
            comment.likes.push(session.user.id as string);
          } else if (comment.likes.includes(session.user.id as string)) {
            comment.likes = comment.likes.filter((id: string) => id !== session.user.id);
          } else {
            comment.likes.push(session.user.id as string);
          }
        } else if (body.commentDisliked) {
          if (comment.likes.includes(session.user.id as string)) {
            comment.likes = comment.likes.filter((id: string) => id !== session.user.id);
            comment.dislikes.push(session.user.id as string);
          } else if (comment.dislikes.includes(session.user.id as string)) {
            comment.dislikes = comment.dislikes.filter((id: string) => id !== session.user.id);
          } else {
            comment.dislikes.push(session.user.id as string);
          }
        }
        let removed: string[] = [];
        comment.likes.forEach((id) => {
          if (!removed.includes(id)) {
            removed.push(id);
          }
        });
        comment.likes = removed;

        removed = [];
        comment.dislikes.forEach((id) => {
          if (!removed.includes(id)) {
            removed.push(id);
          }
        });
        comment.dislikes = removed;

        await Comment.findByIdAndUpdate(body.commentId, {
          $set: comment,
        }).exec();
        await comment.save();
      }
      return NextResponse.json({ success: true, post, comment }, { status: 200 });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ success: false, error: e }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
