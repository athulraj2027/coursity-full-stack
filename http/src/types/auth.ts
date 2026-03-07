// src/types/auth.ts
import type { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  id: string;
  role: "TEACHER" | "ADMIN" | "STUDENT";
  username: string;
  isVerified: boolean;
}
