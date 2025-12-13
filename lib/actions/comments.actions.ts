"use server";

import { commentSchema } from "@/app/schemas/comment";
import z from "zod";
import { getToken } from "../auth-server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const createCommentAction = async (
  values: z.infer<typeof commentSchema>
) => {
  try {
    const parsed = commentSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Something went wrong");
    }

    const token = await getToken();

    await fetchMutation(
      api.comments.createComment,
      {
        body: parsed.data.body,
        postId: parsed.data.postId,
      },
      {
        token,
      }
    );
  } catch {
    return {
      error: "Failed to create post",
    };
  }
};
