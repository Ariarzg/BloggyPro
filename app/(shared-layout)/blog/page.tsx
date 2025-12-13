import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-static";
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Blog | Bloggy",
  description: "Insights, thoughts and trends on bloggy",
  authors: [{ name: "Aria Rouzegar" }],
};

const BlogPage = () => {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="text-xl text-muted-foreground pt-4 max-w-2xl mx-auto">
          Insights, thoughts and trends from our team.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<PostsSkeleton />}>
          <Posts />
        </Suspense>
      </div>
    </div>
  );
};

const Posts = async () => {
  const data = await fetchQuery(api.posts.getPosts);

  return data?.map((post) => (
    <Card key={post._id} className="pt-0 overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={post.imageUrl ?? "/default_post_bg.jpeg"}
          alt="wallpaper"
          fill
          className="object-cover"
        />
      </div>

      <CardContent>
        <Link href={`/blog/${post._id}`}>
          <h1 className="text-2xl font-bold hover:text-primary transition-colors">
            {post.title.charAt(0).toUpperCase() + post.title.slice(1)}
          </h1>
        </Link>
        <p className="text-muted-foreground line-clamp-3">{post.body}</p>
      </CardContent>

      <CardFooter className="mt-auto">
        <Link
          className={buttonVariants({
            className: "w-full",
          })}
          href={`/blog/${post._id}`}
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
  ));
};

const PostsSkeleton = () => {
  return [...Array(3)].map((_, index) => (
    <div key={index} className="flex flex-col space-y-3">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="space-y-2 flex flex-col">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  ));
};

export default BlogPage;
