import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { type Session } from "lucia";

import DeletePostButton from "@/components/DeletePostButton";
import SinglePost from "@/components/SinglePost";

import { getSession } from "@/lib/lucia";
import Comment, { type IComment } from "@/lib/models/comment";
import Post, { type IPost } from "@/lib/models/post";
import User, { type IUser } from "@/lib/models/user";

export default async function PostById({ params }: { params: { id: string } }) {
  const session: Session = await getSession();
  if (!session) {
    return redirect("/login");
  }

  let post = (await Post.findById(params.id).exec()) as IPost;
  if (!post) {
    return notFound();
  }

  post = post.toObject();

  const user = (await User.findById(post.user_id).exec()) as IUser;
  if (!user) {
    return notFound();
  }
  const username = user.username;

  let comments: IComment[] = [];
  for (let i = 0; i <= post.comments.length - 1; i++) {
    const comment = (await Comment.findById(post.comments[i]).exec()) as IComment;
    if (!user) {
      return notFound();
    } else {
      comments.push(comment);
    }
  }

  comments = comments.map((comment) => comment.toObject());

  const commentUsernames: string[] = [];
  for (let i = 0; i <= comments.length - 1; i++) {
    const user = (await User.findById(comments[i].user_id).exec()) as IUser;
    if (!user) {
      return notFound();
    } else {
      commentUsernames.push(user.username);
    }
  }

  const sessionUser = session.user as IUser;
  if (sessionUser.id !== post.user_id) {
    return (
      <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
        <Link href={`/posts`} className="fixed top-0 left-0 mt-5 p-2 ml-4">
          See All Posts
        </Link>
        <SinglePost post={post} user={username} comments={comments} commentUsernames={commentUsernames} />
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
        <Link href={`/posts`} className="fixed top-0 left-0 mt-5 p-2 ml-4">
          See All Posts
        </Link>
        <SinglePost post={post} user={username} comments={comments} commentUsernames={commentUsernames} />
        <DeletePostButton postId={post._id as string} />
      </main>
    );
  }
}
