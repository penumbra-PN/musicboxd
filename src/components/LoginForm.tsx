"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserLogin, type UserLoginType } from "@/lib/validators/user";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserLoginType>({ resolver: zodResolver(UserLogin) });
  const router = useRouter();

  const login = async (data: UserLoginType) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
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
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(login)}>
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
        Log In
      </button>
    </form>
  );
}
