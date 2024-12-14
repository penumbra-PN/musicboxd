"use client";

import { useRouter, redirect } from "next/navigation";

import { toast } from "react-toastify";

type PostProps = {
  postId: string;
};

export default function DeletePostButton(props: PostProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            postId: props.postId,
          }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        router.push("/posts");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <button
      className="absolute bottom-0 left-0 w-fit border border-solid border-red-600 p-2 m-4 text-red-600"
      onClick={() => handleDelete()}
    >
      Delete
    </button>
  );
}
