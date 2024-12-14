import { z } from "zod";

export const CreateComment = z.object({
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

export type CreateCommentType = z.infer<typeof CreateComment>;