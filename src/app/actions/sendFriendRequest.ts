"use server";

import User, { type IUser } from "@/lib/models/user";
import { ServerActionResponse } from "@/lib/actions";

export async function sendFriendRequest(senderId: string, receiverUsername: string): Promise<ServerActionResponse> {
  const receiver = (await User.findOne({ username: receiverUsername })) as IUser;
  if (!receiver) {
    return {
      success: false,
      error: "User not found.",
      data: null,
    };
  }

  if (receiver.id === senderId) {
    return {
      success: false,
      error: "You can't friend yourself.",
      data: null,
    };
  }

  receiver.friend_requests.push(senderId);
  await receiver.save();

  return {
    success: true,
    error: null,
    data: null,
  };
}
