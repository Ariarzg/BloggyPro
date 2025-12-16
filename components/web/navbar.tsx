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
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "../ui/separator";

export function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isAuthenticated, isLoading } = useConvexAuth();

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsNavOpen(false);
      }
    }

    if (isNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavOpen]);

  const router = useRouter();

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Menu
            ref={buttonRef}
            className={`size-12 p-2 md:hidden cursor-pointer transition-colors rounded-md duration-300 ${
              isNavOpen && "bg-popover"
            }`}
            onClick={() => setIsNavOpen((v) => !v)}
          />

          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                ref={menuRef}
                initial={{
                  x: "-200%",
                }}
                animate={{
                  x: 0,
                }}
                exit={{
                  x: "-200%",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="p-4 text-popover-foreground bg-popover absolute top-[120%] rounded-md flex flex-col gap-4 w-3xs sm:w-auto"
              >
                <div className="flex gap-2 justify-around">
                  <Link
                    href="/blog"
                    className={buttonVariants({
                      variant: "link",
                    })}
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/create"
                    className={buttonVariants({
                      variant: "default",
                    })}
                  >
                    Create
                  </Link>
                </div>

                <Separator className="sm:hidden" />

                <div className="sm:hidden">
                  <SearchInput />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link href="/">
          <h1 className="text-3xl font-bold">
            Bloggy<span className="text-primary">Pro</span>
          </h1>
        </Link>
        <div className="items-center gap-2 hidden md:flex">
          <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
            Blogs
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <div className="mr-2">
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
            <Link
              className={buttonVariants({
                variant: "default",
                className: "hidden! sm:block!",
              })}
              href="/auth/sign-up"
            >
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
      <div className="flex items-center gap-2 md:hidden">
        <div className="hidden sm:block mr-2">
          <SearchInput />
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
