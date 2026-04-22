import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email(),
    role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;
