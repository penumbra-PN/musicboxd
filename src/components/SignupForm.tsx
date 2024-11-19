"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserSignup, UserSignupType } from "@/lib/validators/user";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserSignupType>({ resolver: zodResolver(UserSignup) });
  const router = useRouter();

  const signup = async (data: UserSignupType) => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        setError("root", {
          message: data.error,
        });
        return;
      }

      router.push("/profile");
    } catch (error) {
      console.log(error);
      setError("root", {
        message: "Internal server error.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(signup)}>
      <div className="flex flex-col">
        <label className="text-xl" htmlFor="username">
          Username
        </label>
        <input className="rounded border border-solid border-black p-2" type="text" {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="text-xl" htmlFor="email">
          Email
        </label>
        <input className="rounded border border-solid border-black p-2" type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="text-xl" htmlFor="password">
          Password
        </label>
        <input className="rounded border border-solid border-black p-2" type="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      {errors.root && <p>{errors.root?.message}</p>}
      <button className="w-full rounded border border-solid border-black p-2" type="submit">
        Sign Up
      </button>
    </form>
  );
}
