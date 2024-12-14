import { z } from "zod";

export const CreateComment = z.object({
  text: z
    .string({
      message: "Text is required.",
    })
    .trim()
    .min(1, {
      message: "Text must have at least 1 character.",
    })
    .max(1000, {
      message: "Text must have at most 1000 characters.",
    }),
});

export type CreateCommentType = z.infer<typeof CreateComment>;
