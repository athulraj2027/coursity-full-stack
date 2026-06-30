import { Role, type User } from "@prisma/client";
import AuthRepositories from "../repositories/auth.repositories.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import { generateResetToken } from "../utils/generatePasswordToken.js";
import { hashToken } from "../utils/hashToken.js";

const signupUser = async (
  name: string,
  email: string,
  role: Role,
  password: string,
) => {
  const existingUser = await AuthRepositories.findByEmail(email);
  if (existingUser) throw new AppError("User already exists", 400);
  const hashedPassword = await bcrypt.hash(password, 10);
  return AuthRepositories.signup({
    name,
    email,
    password: hashedPassword,
    role: role || Role.STUDENT,
  });
};

const signinUser = async (email: string, password: string) => {
  const user = await AuthRepositories.signin(email);
  if (!user) throw new AppError("No user found", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid password", 400);

  return user;
};

const getUserById = async (userId: string) => {
  const user = await AuthRepositories.findById(userId);
  if (!user) throw new AppError("User not found", 400);
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await AuthRepositories.findByEmail(email);
  if (!user) throw new AppError("User not found", 400);
  return user;
};

const createResetToken = async (user: any) => {
  const token = generateResetToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(
    Date.now() + 30 * 60 * 1000, // 30 min
  );
  await AuthRepositories.saveResetToken(hashedToken, user, expiresAt);
  return token;
};

const verifyResetToken = async (token: string, password: string) => {
  const hashedToken = hashToken(token);
  const isTokenValid = await AuthRepositories.verifyResetToken(hashedToken);
  if (!isTokenValid) throw new AppError("Invalid token", 400);
  if (isTokenValid.expiresAt.getTime() < Date.now())
    throw new AppError("Token expired.Please try again.", 400);
  const hashedPassword = await bcrypt.hash(password, 10);
  await AuthRepositories.updatePassword(isTokenValid.userId, hashedPassword);
};

const checkResetToken = async (user: any) => {
  const token = await AuthRepositories.checkResetToken(user);
  return token;
};

const deleteResetToken = async (user: any) => {
  await AuthRepositories.deleteResetToken(user);
};

export default {
  signinUser,
  signupUser,
  getUserById,
  getUserByEmail,
  createResetToken,
  verifyResetToken,
  checkResetToken,
  deleteResetToken,
};
