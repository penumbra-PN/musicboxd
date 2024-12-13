import { z } from "zod";

export const Signup = z.object({
  username: z
    .string({
      message: "Username is required.",
    })
    .min(3, {
      message: "Username must have at least 3 characters.",
    })
    .max(31, {
      message: "Username must have at most 31 characters.",
    }),
  email: z
    .string({
      message: "Email is required.",
    })
    .email({
      message: "Invalid email.",
    }),
  password: z
    .string({
      message: "Password is required.",
    })
    .min(8, {
      message: "Password must have at least 8 characters.",
    })
    .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-._@+!]).*/, {
      message: "Password must have at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special character.",
    }),
});

export type SignupType = z.infer<typeof Signup>;

export const Login = z.object({
  email: z
    .string({
      message: "Email is required.",
    })
    .email({
      message: "Invalid email.",
    }),
  password: z
    .string({
      message: "Password is required.",
    })
    .min(8, {
      message: "Password must have at least 8 characters.",
    })
    .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-._@+!]).*/, {
      message: "Password must have at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special character.",
    }),
});

export type LoginType = z.infer<typeof Login>;

export const EditProfile = z.object({
  username: z
    .string({
      message: "Username is required.",
    })
    .min(3, {
      message: "Username must have at least 3 characters.",
    })
    .max(31, {
      message: "Username must have at most 31 characters.",
    }),
  bio: z
    .string({
      message: "Bio is required.",
    })
    .max(255, {
      message: "Bio must have at most 255 characters.",
    }),
});

export type EditProfileType = z.infer<typeof EditProfile>;

export const SendMessage = z.object({
  channelId: z.string({
    message: "ChannelId is required.",
  }),
  userId: z.string({
    message: "UserId is required.",
  }),
  text: z
    .string({
      message: "Text is required.",
    })
    .min(1, {
      message: "Text must contain have at least 1 character.",
    }),
});

export type SendMessageType = z.infer<typeof SendMessage>;
