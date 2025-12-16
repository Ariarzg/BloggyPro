"use client";

import { signUpSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account created successfully");
            router.push("/");
          },
          onError: (err) => {
            toast.error(err.error.message);
          },
        },
      });
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    {...field}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="john@doe.com"
                    type="email"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Field className="grid grid-cols-2 gap-4">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <div className="relative">
                        <Input
                          aria-invalid={fieldState.invalid}
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <span
                          tabIndex={-1}
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-popover p-1 rounded-full"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </span>
                      </div>
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <div className="relative">
                        <Input
                          aria-invalid={fieldState.invalid}
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <span
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-popover p-1 rounded-full"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </span>
                      </div>
                    </Field>
                  )}
                />
              </Field>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/auth/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
