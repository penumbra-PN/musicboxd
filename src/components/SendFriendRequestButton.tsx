"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type SendFriendRequestButtonProps = {
  username: string;
};

export default function SendFriendRequestButton(props: SendFriendRequestButtonProps) {
  const router = useRouter();

  const sendFriendRequest = async () => {
    try {
      const response = await fetch("/api/user/friend/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: props.username,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        router.refresh();
        toast.success("Successfully sent friend request.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  return (
    <button className="w-fit rounded border border-solid border-black p-2" onClick={() => sendFriendRequest()}>
      Send Friend Request
    </button>
  );
}
