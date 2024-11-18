"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditUserProfile, type EditUserProfileType } from "@/lib/validators/user";

type EditProfileFormProps = {
  id: string;
  username: string;
  bio: string;
};

export default function EditProfileForm(props: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditUserProfileType>({ resolver: zodResolver(EditUserProfile) });

  const editProfile = async (data: EditUserProfileType) => {
    try {
      const response = await fetch(`/api/user/${props.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
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
    <form onSubmit={handleSubmit(editProfile)}>
      <div>
        <label htmlFor="username">Username: </label>
        <input type="text" defaultValue={props.username} {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div>
        <label htmlFor="username">Bio: </label>
        <input type="text" defaultValue={props.bio} {...register("bio")} />
        {errors.bio && <span>{errors.bio.message}</span>}
      </div>
      {errors.root && <p>{errors.root?.message}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
