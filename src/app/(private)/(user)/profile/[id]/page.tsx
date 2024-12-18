import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { type Session } from "lucia";

import DeleteUserButton from "@/components/DeleteUserButton";
import LogoutButton from "@/components/LogoutButton";
import ProfileSections from "@/components/ProfileSections";
import SendFriendRequestButton from "@/components/SendFriendRequestButton";
//import Header from "@/components/Header";

import { getSession } from "@/lib/lucia";
import Channel, { type IChannel } from "@/lib/models/channel";
import Comment, { type IComment } from "@/lib/models/comment";
import Post, { type IPost } from "@/lib/models/post";
import Review, { type IReview } from "@/lib/models/review";
import User, { type IUser } from "@/lib/models/user";

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

    const channel = (await Channel.findOne({
      $or: [
        { $and: [{ userA_id: sessionUser.id }, { userB_id: user.id }] },
        { $and: [{ userB_id: sessionUser.id }, { userA_id: user.id }] }
      ]
    }).exec()) as IChannel;

    return (
      <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4 bg-spotify-black text-spotify-white">
        <h1 className="text-4xl text-spotify-green">{user.username}&#39;s Profile</h1>
        <p>{user.bio}</p>
        {user.friends.includes(sessionUser.id) ? (
          channel ? (
            <a className="w-fit border border-solid border-black p-2" href={`/channel/${channel.id}`}>
              Go to Messages
            </a>
          ) : null
        ) : (
          <SendFriendRequestButton username={user.username} />
        )}
      </main>
    );
  }

  const friends = await Promise.all(
    sessionUser.friends.map(async (id) => {
      const channel = (await Channel.findOne({
        $or: [
          { $and: [{ userA_id: sessionUser.id }, { userB_id: id }] },
          { $and: [{ userB_id: sessionUser.id }, { userA_id: id }] }
        ]
      }).exec()) as IChannel;
      if (!channel) {
        return notFound();
      }

      return {
        friend: (await User.findById(id).exec()) as IUser,
        channelId: channel.id
      };
    })
  );
  const friendRequests = await Promise.all(
    sessionUser.friend_requests.map(async (id) => (await User.findById(id).exec()) as IUser)
  );
  const reviews = await Promise.all(
    sessionUser.reviews.map(async (id) => (await Review.findById(id).exec()) as IReview)
  );
  const posts = await Promise.all(sessionUser.posts.map(async (id) => (await Post.findById(id).exec()) as IPost));
  const comments = await Promise.all(
    sessionUser.comments.map(async (id) => (await Comment.findById(id).exec()) as IComment)
  );

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-4 relative bg-spotify-black text-spotify-white">
      <Link className="absolute top-0 left-0 w-fit border border-solid border-black p-2 m-4 rounded-3xl bg-spotify-green text-spotify-black" href="/home">Home</Link>
      <Link className="absolute top-0 right-0 w-fit border border-solid border-black p-2 m-4 rounded-3xl bg-spotify-green text-spotify-black" href={`/profile/${sessionUser.id}/edit`}>Edit</Link>
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
      <DeleteUserButton />
    </main>
  );
}
