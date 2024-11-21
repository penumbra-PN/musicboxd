"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Login, type LoginType } from "@/lib/validators/user";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginType>({ resolver: zodResolver(Login) });
  const router = useRouter();

  const login = async (body: LoginType) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError("root", {
          message: data.error,
        });
      } else {
        router.push(`/profile/${data.id}`);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setError("root", {
        message: "Internal server error.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      <h1 className="text-4xl">
        <strong>Log In</strong>
      </h1>
      <form className="flex min-w-80 flex-col gap-y-4" onSubmit={handleSubmit(login)}>
        <div className="flex flex-col">
          <label className="text-xl" htmlFor="email">
            Email
          </label>
          <input className="rounded border border-solid border-black p-2" type="email" {...register("email")} />
          {errors.email && <span className="text-red-600">{errors.email.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="text-xl" htmlFor="password">
            Password
          </label>
          <input className="rounded border border-solid border-black p-2" type="password" {...register("password")} />
          {errors.password && <span className="text-red-600">{errors.password.message}</span>}
        </div>
        {errors.root && <span className="text-red-600">{errors.root?.message}</span>}
        <button className="w-full rounded border border-solid border-black p-2" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
