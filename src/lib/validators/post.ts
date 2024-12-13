import { z } from "zod";

export const CreatePost = z.object({
    title: z
        .string({
            message: "Title is required.",
        })
        .trim()
        .min(8, {
            message: "Title must have at least 8 characters and cannot just be numbers or special characters.",
        })
        .max(100, {
            message: "Title must have at most 100 characters.",
        })
        .regex(/[a-zA-Z]/, {
            message: "Title cannot just be numbers or special characters.",
        }),
    text: z
        .string({
            message: "Text is required.",
        })
        .trim()
        .min(8, {
            message: "Text must have at least 8 characters and cannot just be numbers or special characters.",
        })
        .max(1000, {
            message: "Text must have at most 1000 characters.",
        })
        .regex(/[a-zA-Z]/, {
            message: "Text cannot just be numbers or special characters.",
        })
});

export type CreatePostType = z.infer<typeof CreatePost>;