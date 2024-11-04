"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        router.push("/");
      } else {
        setError("Failed to log in");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to log in");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-40 max-w-lg rounded-md bg-white p-6 shadow-md">
      <h3 className="mb-4 text-center text-2xl font-bold text-gray-700">Log In</h3>
      <div className="mb-4">
        <label htmlFor="loginEmail" className="mb-2 block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          type="email"
          id="loginEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="loginPassword" className="mb-2 block text-sm font-medium text-gray-700">
          Password:
        </label>
        <input
          type="password"
          id="loginPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="my-4 text-sm font-bold text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>
    </form>
  );
}
