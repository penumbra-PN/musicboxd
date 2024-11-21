"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { IUser } from "@/lib/models/user";

type FriendRequestsListProps = {
  friendRequests: IUser[];
};

export default function FriendRequestsList(props: FriendRequestsListProps) {
  const [error, setError] = useState<string | null>(null);
  const [friendRequests, setFriendRequests] = useState<IUser[]>(props.friendRequests);
  const router = useRouter();

  const acceptFriendRequest = async (id: string) => {
    try {
      const response = await fetch("/api/user/friend/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message);
      } else {
        setFriendRequests((friendRequests) => friendRequests.filter((request) => request._id !== data.user._id));
        setError(null);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setError("Internal server error.");
    }
  };

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="flex flex-col gap-y-4">
        {friendRequests.map((friendRequest) => {
          return (
            <li className="flex grow justify-between" key={friendRequest._id as string}>
              <Link className="hover:underline" href={`/profile/${friendRequest._id}`}>
                {friendRequest.username}
              </Link>
              <div className="flex gap-x-2">
                <button onClick={() => acceptFriendRequest(friendRequest._id as string)}>Accept</button>
                <button>Reject</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
