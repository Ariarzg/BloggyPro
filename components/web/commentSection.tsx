"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { commentSchema } from "@/app/schemas/comment";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import z from "zod";
import { useTransition } from "react";
import { createCommentAction } from "@/lib/actions/comments.actions";
import { toast } from "sonner";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const CommentSection = (props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) => {
  const [isPending, startTransition] = useTransition();

  const params = useParams<{ postId: Id<"posts"> }>();

  const data = usePreloadedQuery(props.preloadedComments);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  const onSubmit = (data: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      try {
        await createCommentAction(data);
        form.reset();
        toast.success("Comment Posted");
      } catch {
        toast.success("Failed To Comment");
      }
    });
  };

  if (data === undefined) {
    return <p>loading...</p>;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{data.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share Your Thoughts"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Comment</span>
            )}
          </Button>
        </form>

        {data.length > 0 && <Separator />}

        <section className="space-y-6">
          {data?.map((comment) => (
            <div className="flex gap-4" key={comment._id}>
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment._creationTime).toLocaleDateString(
                      "en-DE"
                    )}
                  </p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
