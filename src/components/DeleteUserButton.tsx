"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

export default function DeleteUserButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error(JSON.stringify(error));
    }
  };

  if (loading) {
    return (
      <div className="absolute bottom-0 left-0 w-fit border border-solid border-red-600 p-2 m-4 text-red-600">
        Currently deleting user data...
      </div>
    );
  }

  return (
    <button
      className="absolute bottom-0 left-0 w-fit border border-solid border-red-600 p-2 m-4 text-red-600"
      onClick={() => handleDelete()}
    >
      Delete
    </button>
  );
}
