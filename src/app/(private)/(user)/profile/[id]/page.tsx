import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { type Session } from "lucia";

import LogoutButton from "@/components/LogoutButton";
import ProfileSections from "@/components/ProfileSections";
import { getSession } from "@/lib/lucia";
import User, { type IUser } from "@/lib/models/user";
import Review, { type IReview } from "@/lib/models/review";
import Post, { type IPost } from "@/lib/models/post";
import Comment, { IComment } from "@/lib/models/comment";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const sessionUser = session.user as IUser;

  if (sessionUser.id !== params.id) {
    const user = (await User.findById(params.id).exec()) as IUser;
    if (!user) {
      return notFound();
    }
    return (
      <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
        <h1 className="text-4xl">{user.username}&#39;s Profile</h1>
        <p>{user.bio}</p>
      </main>
    );
  }

  const friends = await Promise.all(sessionUser.friends.map(async (id) => (await User.findById(id).exec()) as IUser));
  const friendRequests = await Promise.all(
    sessionUser.friend_requests.map(async (id) => (await User.findById(id).exec()) as IUser),
  );
  const reviews = await Promise.all(
    sessionUser.reviews.map(async (id) => (await Review.findById(id).exec()) as IReview),
  );
  const posts = await Promise.all(sessionUser.posts.map(async (id) => (await Post.findById(id).exec()) as IPost));
  const comments = await Promise.all(
    sessionUser.comments.map(async (id) => (await Comment.findById(id).exec()) as IComment),
  );

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4">
      <Link href={`/profile/${sessionUser.id}/edit`}>Edit</Link>
      <h1 className="text-4xl">{sessionUser.username}&#39;s Profile</h1>
      <p>{sessionUser.bio}</p>
      <ProfileSections
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
