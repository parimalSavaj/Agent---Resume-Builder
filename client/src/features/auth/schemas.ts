import { z } from "zod";

export const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(64, "Username must be at most 64 characters")
      .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, underscores, dots, and hyphens allowed"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
