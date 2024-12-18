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
    <button className="absolute top-0 right-0 p-2 m-4 w-fit rounded-3xl font-bold border border-solid hover:bg-spotify-white border-black bg-spotify-green text-spotify-black" onClick={handleLogout}>
      Log Out
    </button>
  );
}
