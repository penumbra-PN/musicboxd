"use client";

import React from "react";

import { useRouter } from "next/navigation";

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
        console.log(data);
      } else {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="w-fit border border-solid border-black p-2" onClick={handleLogout}>
      Log Out
    </button>
  );
}
