import { notFound, redirect } from "next/navigation";

import { type Session } from "lucia";

import ChannelMessages from "@/components/ChannelMessages";

import { getSession } from "@/lib/lucia";
import Channel, { type IChannel } from "@/lib/models/channel";
import Message, { type IMessage } from "@/lib/models/message";
import User, { type IUser } from "@/lib/models/user";

export default async function ChannelPage({ params }: { params: { id: string } }) {
  const session: Session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const channel = (await Channel.findById(params.id).exec()) as IChannel;
  if (!channel) {
    return notFound();
  }

  const sessionUser = session.user as IUser;
  if (channel.userA_id !== sessionUser.id && channel.userB_id !== sessionUser.id) {
    return notFound();
  }

  const messages = await Promise.all(
    channel.messages.map(async (id) => {
      const message = (await Message.findById(id).exec()) as IMessage;
      return {
        message: message,
        username: ((await User.findById(message.user_id).exec()) as IUser).username,
      };
    }),
  );

  return (
    <main className="flex grow flex-col items-center justify-center gap-y-4 bg-spotify-black text-spotify-white">
      <ChannelMessages
        userId={sessionUser.id}
        username={sessionUser.username}
        channelId={channel.id}
        messages={JSON.parse(JSON.stringify(messages))}
      />
    </main>
  );
}
