"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { editProfile } from "@/app/actions/editProfile";
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

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(async (data: EditUserProfileType) => {
        try {
          const response = await editProfile(props.id, data);
          if (!response.success) {
            setError("root", {
              message: response.error ?? "Unknown error.",
            });
          }
        } catch {
          setError("root", {
            message: "Internal server error.",
          });
        }
      })}
    >
      <div>
        <label className="text-2xl" htmlFor="username">
          Username:
        </label>
        <input type="text" defaultValue={props.username} {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}
      </div>
      <div>
        <label className="text-2xl" htmlFor="username">
          Bio:
        </label>
        <input type="text" defaultValue={props.bio} {...register("bio")} />
        {errors.bio && <span>{errors.bio.message}</span>}
      </div>
      {errors.root && <p>{errors.root?.message}</p>}
      <button className="text-2xl" type="submit">
        Save
      </button>
    </form>
  );
}
