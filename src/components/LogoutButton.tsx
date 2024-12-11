"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data);
      } else {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  return (
    <button className="w-fit border border-solid border-black p-2 bg-spotify-green text-spotify-black" onClick={handleLogout}>
      Log Out
    </button>
  );
}
