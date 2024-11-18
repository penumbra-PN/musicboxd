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
      if (response.ok) {
        router.push("/profile");
      } else {
        const data = await response.json();
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
    <form onSubmit={handleSubmit(signup)}>
      <div>
        <label htmlFor="username">Username: </label>
        <input type="text" {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
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
      <button type="submit">Sign Up</button>
    </form>
  );
}
