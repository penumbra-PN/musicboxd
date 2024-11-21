"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

import { type IUser } from "@/lib/models/user";
import { useRouter } from "next/navigation";

type FriendsListProps = {
  friends: IUser[];
};

export default function FriendsList(props: FriendsListProps) {
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<IUser[]>(props.friends);
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
          setFriends((friends) => [...friends, data.user]);
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

  return (
    <div className="flex flex-col gap-y-2">
      {error && <p className="text-red-600">{error}</p>}
      <form className="flex items-center justify-between gap-x-2" onSubmit={(e) => sendFriendRequest(e)}>
        <label htmlFor="username">Send Friend Request:</label>
        <input className="grow border border-solid border-black p-2" type="text" name="username" ref={input} />
        <button className="w-fit border border-solid border-black p-2" type="submit">
          Send
        </button>
      </form>
      <ul>
        {friends.map((friend) => {
          return (
            <li key={friend._id as string}>
              <Link className="hover:underline" href={`/profile/${friend._id}`}>
                {friend.username}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
