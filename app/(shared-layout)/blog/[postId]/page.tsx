import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/commentSection";
import PostPresence from "@/components/web/postPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface postIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export const generateMetadata = async ({
  params,
}: postIdRouteProps): Promise<Metadata> => {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId });

  if (!post)
    return {
      title: "Post not found",
    };

  return {
    title: post.title + " | Bloggy",
    description: post.body,
  };
};

const PostIdRoute = async ({ params }: postIdRouteProps) => {
  const { postId } = await params;

  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId: postId }),

    preloadQuery(api.comments.getCommentsByPostId, { postId }),

    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!post) {
    return (
      <h1 className="text-6xl font-extrabold text-red-500">No Post Found</h1>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href={"/blog"}
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={post.imageUrl ?? "/default_post_bg.jpeg"}
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Posted on:{" "}
            {new Date(post._creationTime).toLocaleDateString("en-DE")}
          </p>

          {userId && <PostPresence roomId={postId} userId={userId} />}
        </div>
      </div>

      <Separator className="my-8" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>

      <Separator className="my-8" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
};

export default PostIdRoute;
