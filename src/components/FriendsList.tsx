"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

import { type IUser } from "@/lib/models/user";
import { useRouter } from "next/navigation";

type FriendsListProps = {
  friends: {
    friend: IUser;
    channelId: string;
  }[];
};

export default function FriendsList(props: FriendsListProps) {
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<
    {
      friend: IUser;
      channelId: string;
    }[]
  >(props.friends);
  const input = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const sendFriendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.current) {
      setError("Input has not been initialized.");
      return;
    }

    try {
      const response = await fetch("/api/user/friend/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: input.current.value,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error);
      } else {
        if (data.user) {
          setFriends((friends) => [
            ...friends,
            {
              friend: data.user,
              channelId: data.channelId,
            },
          ]);
        }
        setError(null);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setError("Internal server error.");
    }

    input.current.value = "";
  };

  const removeFriend = async (id: string) => {
    try {
      const response = await fetch("/api/user/friend/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message);
      } else {
        setFriends((e) => e.filter((x) => x.friend._id !== data.user._id));
        setError(null);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setError("Internal server error.");
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {error && <span className="text-red-600">{error}</span>}
      <form className="flex items-center justify-between gap-x-2" onSubmit={(e) => sendFriendRequest(e)}>
        <label htmlFor="username">Send Friend Request:</label>
        <input className="grow border border-solid border-black p-2" type="text" name="username" ref={input} />
        <button className="w-fit border border-solid border-black p-2" type="submit">
          Send
        </button>
      </form>
      <ul className="flex flex-col gap-y-4">
        {friends.map((e) => {
          return (
            <li className="flex grow items-center justify-between" key={e.friend._id as string}>
              <Link className="hover:underline" href={`/profile/${e.friend._id}`}>
                {e.friend.username}
              </Link>
              <div className="flex gap-x-2">
                <Link className="w-fit border border-solid border-black p-2" href={`/channel/${e.channelId}`}>
                  Message
                </Link>
                <button
                  className="w-fit border border-solid border-black p-2"
                  onClick={() => removeFriend(e.friend._id as string)}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
