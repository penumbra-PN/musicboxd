"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/login");
  };

  return (
    <button className="w-fit border border-solid border-black p-2" onClick={handleLogout}>
      Log Out
    </button>
  );
}
