"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditProfile, type EditProfileType } from "@/lib/validators/user";

type EditProfileFormProps = {
  username: string;
  bio: string;
};

export default function EditProfileForm(props: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileType>({ resolver: zodResolver(EditProfile) });
  const router = useRouter();

  const editProfile = async (body: EditProfileType) => {
    try {
      const response = await fetch("/api/user/edit", {
        method: "PATCH",
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
      }

      router.refresh();
    } catch (error) {
      console.log(error);
      setError("root", {
        message: "Internal server error.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(editProfile)}>
      <div className="flex items-center gap-x-2">
        <label htmlFor="username">Username:</label>
        <input
          className="grow border border-solid border-black p-2"
          type="text"
          defaultValue={props.username}
          {...register("username")}
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div className="flex items-center gap-x-2">
        <label htmlFor="username">Bio:</label>
        <input
          className="grow border border-solid border-black p-2"
          type="text"
          defaultValue={props.bio}
          {...register("bio")}
        />
        {errors.bio && <span>{errors.bio.message}</span>}
      </div>
      {errors.root && <p>{errors.root?.message}</p>}
      <button className="w-fit self-center border border-solid border-black p-2" type="submit">
        Save
      </button>
    </form>
  );
}
