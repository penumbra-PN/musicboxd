import { type ReactNode } from "react";

import Link from "next/link";
import { redirect } from "next/navigation";

import { type Session } from "lucia";

import { getSession } from "@/lib/lucia";
import Channel, { type IChannel } from "@/lib/models/channel";
import User, { type IUser } from "@/lib/models/user";

export default async function ChannelLayout({ children }: { children: ReactNode }) {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const sessionUser = session.user as IUser;

  const friends = await Promise.all(
    sessionUser.friends.map(async (id) => {
      const friend = (await User.findById(id).exec()) as IUser;

      return {
        friend: friend,
        channelId: (
          (await Channel.findOne({
            $or: [
              {
                userA_id: sessionUser.id,
                userB_id: friend.id,
              },
              {
                userA_id: friend.id,
                userB_id: sessionUser.id,
              },
            ],
          })) as IChannel
        ).id,
      };
    }),
  );

  return (
    <div className="flex h-screen w-screen bg-spotify-black text-spotify-white">
      <ul className="flex min-w-40 flex-col border-r border-solid border-spotify-green">
        <Link className="w-full border-b border-solid border-spotify-green p-2 hover:text-spotify-green hover:underline" href={`/profile/${sessionUser.id}`}>
          Back
        </Link>
        {friends.map((e) => {
          return (
            <li className="w-full p-2 hover:text-spotify-green" key={e.channelId}>
              <Link href={`/channel/${e.channelId}`}>{e.friend.username}</Link>
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}
