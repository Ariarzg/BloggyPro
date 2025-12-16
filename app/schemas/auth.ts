import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name Is Required").max(30),
    email: z.email("Invalid Email!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(30),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const passwordCheck = z.string().min(8).safeParse(data.password);

    if (!passwordCheck.success) {
      return;
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match.",
        code: "custom",
      });
    }
  });

export const loginSchema = z.object({
  email: z.email("Invalid Email!"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(30),
});
