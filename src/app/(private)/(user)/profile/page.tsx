import Link from "next/link";
import { redirect } from "next/navigation";
import { type Session } from "lucia";

import LogoutButton from "@/components/LogoutButton";
import ProfileSections from "@/components/ProfileSections";
import { getSession } from "@/lib/lucia";
import User, { type IUser } from "@/lib/models/user";
import Review from "@/lib/models/review";
import Post from "@/lib/models/post";
import Comment from "@/lib/models/comment";

export default async function ProfilePage() {
  const session: Session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as IUser;
  const friends = await Promise.all(user.friends.map(async (_id) => await User.findById(_id)));
  const friendRequests = await Promise.all(user.friend_requests.map(async (_id) => await User.findById(_id)));
  const reviews = await Promise.all(user.reviews.map(async (_id) => await Review.findById(_id)));
  const posts = await Promise.all(user.posts.map(async (_id) => await Post.findById(_id)));
  const comments = await Promise.all(user.comments.map(async (_id) => await Comment.findById(_id)));

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
      <Link href="/profile/edit">Edit</Link>
      <h1 className="text-4xl">{session.user.username}&#39;s Profile</h1>
      <div className="flex flex-col">
        <h2 className="text-2xl">Bio</h2>
        <p>{session.user.bio}</p>
      </div>
      <ProfileSections
        userId={user.id}
        friends={JSON.parse(JSON.stringify(friends))}
        friendRequests={JSON.parse(JSON.stringify(friendRequests))}
        reviews={JSON.parse(JSON.stringify(reviews))}
        posts={JSON.parse(JSON.stringify(posts))}
        comments={JSON.parse(JSON.stringify(comments))}
      />
      <LogoutButton />
    </main>
  );
}
