import { z } from "zod";

export const UserSignup = z.object({
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
    .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-._@+]).*/, {
      message: "Password must have at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special character.",
    }),
});

export type UserSignupType = z.infer<typeof UserSignup>;

export const UserLogin = z.object({
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
    .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-._@+]).*/, {
      message: "Password must have at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special character.",
    }),
});

export type UserLoginType = z.infer<typeof UserLogin>;
