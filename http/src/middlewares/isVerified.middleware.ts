import type { NextFunction, Request, Response } from "express";

export const isUserVerifiedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  if (user.isVerified) next();

  return res
    .status(401)
    .json({ message: "Verify your email address to access this feature" });
};
