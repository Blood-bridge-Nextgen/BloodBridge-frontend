import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string({ error: "Password is required" }),
  rememberMe: z.boolean().optional(),
});
