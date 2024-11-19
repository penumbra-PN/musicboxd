"use server";

import { revalidatePath } from "next/cache";

import { type ServerActionResponse } from "@/lib/actions";
import { type EditUserProfileType } from "@/lib/validators/user";
import User from "@/lib/models/user";

export async function editProfile(id: string, body: EditUserProfileType): Promise<ServerActionResponse> {
  await User.findByIdAndUpdate(id, {
    $set: body,
  });
  revalidatePath("/profile");

  return {
    success: true,
    error: null,
    data: null,
  };
}
