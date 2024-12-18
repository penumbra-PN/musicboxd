"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { CreatePost, type CreatePostType } from "@/lib/validators/post";

export default function CreatePostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostType>({ resolver: zodResolver(CreatePost) });
  const router = useRouter();

  const createPost = async (body: CreatePostType) => {
    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      }
      toast.success("Successfully Created Post.");
      router.push("/posts");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(createPost)}>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="title">
          <strong>Title:</strong>
        </label>
        <input className="grow border border-solid border-black p-2 bg-textbox-gray text-spotify-black" type="text" {...register("title")} />
        {errors.title && <span className="text-red-600">{errors.title.message}</span>}
      </div>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="text">
          <strong>Text:</strong>
        </label>
        <textarea className="grow border border-solid border-black p-2 bg-textbox-gray text-spotify-black" {...register("text")} />
        {errors.text && <span className="text-red-600">{errors.text.message}</span>}
      </div>
      {errors.root && <span className="text-red-600">{errors.root?.message}</span>}
      <button className="w-fit rounded-3xl self-center border border-solid border-black p-2 bg-spotify-green text-spotify-black font-bold" type="submit">
        Submit
      </button>
    </form>
  );
}
