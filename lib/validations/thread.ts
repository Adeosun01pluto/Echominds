import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
  picture: z.string(), // Add validation for an array of strings
});

export const CommunityValidation = z.object({
  name: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  description: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  username: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  picture: z.string(), // Add validation for an array of strings
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});