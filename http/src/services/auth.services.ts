import { Role } from "@prisma/client";
import AuthRepositories from "../repositories/auth.repositories.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";

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

export default { signinUser, signupUser, getUserById };
