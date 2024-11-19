"use client";

import { useState } from "react";

import { sendFriendRequest } from "@/app/actions/sendFriendRequest";
import { type IUser } from "@/lib/models/user";

type FriendsListProps = {
  userId: string;
  friends: IUser[];
};

export default function FriendsList(props: FriendsListProps) {
  const [error, setError] = useState<null | string>(null);
  const [username, setUsername] = useState("");

  return (
    <div className="flex flex-col gap-y-2">
      <div>
        <label htmlFor="username">Send Friend Request:</label>
        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button
          onClick={async () => {
            try {
              const response = await sendFriendRequest(props.userId, username);
              if (!response.success) {
                setError(response.error ?? "Unknown error.");
              } else {
                setError(null);
              }
            } catch {
              setError("Internal server error.");
            }
          }}
        >
          Send
        </button>
      </div>
      {error && <p>{error}</p>}
      <div>
        {props.friends.map((user) => {
          return <div key={user.id}></div>;
        })}
      </div>
    </div>
  );
}
