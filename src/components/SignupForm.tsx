"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        setError("Unable to sign up.");
      }
    } catch (error) {
      console.log(error);
      setError("Unable to sign up.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-40 max-w-lg rounded-md bg-white p-6 shadow-md">
      <h3 className="mb-4 text-center text-2xl font-bold text-gray-700">Sign up</h3>
      <div className="mb-4">
        <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Sign up
      </button>
    </form>
  );
}
