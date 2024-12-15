"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import type { IUser } from "@/lib/models/user";

type FriendRequestsListProps = {
  friendRequests: IUser[];
};

export default function FriendRequestsList(props: FriendRequestsListProps) {
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
        toast.error(data.message);
      } else {
        setFriendRequests((friendRequests) => friendRequests.filter((request) => request._id !== data.user._id));
        router.refresh();
        toast.success("Successfully accepted friend request.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  const rejectFriendRequest = async (id: string) => {
    try {
      const response = await fetch("/api/user/friend/reject", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message);
      } else {
        setFriendRequests((friendRequests) => friendRequests.filter((request) => request._id !== data.user._id));
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  return (
    <div>
      <ul className="flex flex-col gap-y-4">
        {friendRequests.map((request) => {
          return (
            <li className="flex grow items-center justify-between" key={request._id as string}>
              <Link className="hover:underline" href={`/profile/${request._id}`}>
                {request.username}
              </Link>
              <div className="flex gap-x-2">
                <button
                  className="w-fit rounded-3xl border border-solid border-black p-2 bg-spotify-green text-spotify-black"
                  onClick={() => acceptFriendRequest(request._id as string)}
                >
                  Accept
                </button>
                <button
                  className="w-fit rounded-3xl border border-solid border-black p-2 bg-spotify-green text-spotify-black"
                  onClick={() => rejectFriendRequest(request._id as string)}
                >
                  Reject
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
