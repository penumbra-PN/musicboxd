import { notFound, redirect } from "next/navigation";
import Link from "next/link";


import { type Session } from "lucia";

import ForumPage from "@/components/ForumPage";

import { getSession } from "@/lib/lucia";
import Post, { type IPost } from "@/lib/models/post";
import User, { type IUser } from "@/lib/models/user";

export const metadata = {
  title: "Posts",
};

export default async function PostPage() {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  try {
    let allPosts = (await Post.find().exec()) as IPost[];
    if (!allPosts) {
      return notFound();
    }

    allPosts = allPosts.map((post) => post.toObject());

    const usernames: string[] = [];
    for (let i = 0; i <= allPosts.length - 1; i++) {
      const user = (await User.findById(allPosts[i].user_id).exec()) as IUser;
      if (!user) {
        usernames.push("Username Not Found");
      } else {
        usernames.push(user.username);
      }
    }

    return (
      <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
        <h1 className="text-4xl">Forum Page</h1>
        <Link className="fixed top-0 left-0 mt-5 ml-4 p-2 w-fit border border-solid border-black p-2" href='/posts/create'>Create A Post</Link>
        <ForumPage posts={allPosts} usernames={usernames} />
      </main>
    );
  } catch (e) {
    console.log(e);
    return <div>An Error Occurred.</div>;
  }
}
