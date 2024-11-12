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
      if (response.ok) {
        router.push("/profile");
      } else {
        const data = await response.json();
        console.log(data.message);
        setError("root", {
          message: data.message,
        });
      }
    } catch (error) {
      console.log(error);
      setError("root", {
        message: "Internal server error.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(login)}>
      <div>
        <label htmlFor="email">Email: </label>
        <input type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input type="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      {errors.root && <p>{errors.root?.message}</p>}
      <button type="submit">Log In</button>
    </form>
  );
}
