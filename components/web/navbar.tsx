"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Menu } from "lucide-react";
import SearchInput from "./searchInput";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const router = useRouter();

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-8">
        <div>
          <Menu className="size-6 sm:hidden" />
        </div>
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Bloggy<span className="text-primary">Pro</span>
          </h1>
        </Link>
        <div className="items-center gap-2 hidden sm:flex">
          <Link className={buttonVariants({ variant: "ghost" })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
            Blog
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:block mr-2">
          <SearchInput />
        </div>
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-[76px]" />
            <Skeleton className="h-9 w-[76px]" />
          </>
        ) : isAuthenticated ? (
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Logged out successfully");
                    router.push("/");
                  },
                  onError: (err) => {
                    toast.error(err.error.message);
                  },
                },
              })
            }
          >
            Logout
          </Button>
        ) : (
          <>
            <Link className={buttonVariants()} href="/auth/sign-up">
              Sign Up
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
              })}
              href="/auth/login"
            >
              Login
            </Link>
          </>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}
