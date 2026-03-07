import type { NextFunction, Request, Response } from "express";
import UserRepository from "../repositories/users.repositories.js";

export const isUserVerifiedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const dbUser = await UserRepository.getUserByIdForAdmin(user.id);
  if (!dbUser) return res.status(400).json({ message: "User not found" });
  if (dbUser.isVerified) return next();

  return res
    .status(401)
    .json({ message: "Verify your email address to access this feature" });
};
