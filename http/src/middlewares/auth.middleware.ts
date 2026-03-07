import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthPayload } from "../types/auth.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.auth_token;

  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET || "myjwtsecret",
    ) as AuthPayload;
    req.user = {
      id: decoded.userId as string,
      role: decoded.role,
      username: decoded.username,
      isVerified: decoded.isVerified,
    };
    console.log("req user ", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
