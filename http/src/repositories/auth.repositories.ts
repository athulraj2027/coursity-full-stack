import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";

const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
};

const signup = async (data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || Role.STUDENT,
    },
  });
};

const updatePassword = async (id: string, password: string) => {
  await prisma.user.update({ where: { id }, data: { password } });
};

const signin = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const findById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
};

const saveResetToken = async (token: string, user: any, expiresAt: Date) => {
  await prisma.passwordResetToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });
};

const checkResetToken = async (user: any) => {
  return await prisma.passwordResetToken.findUnique({
    where: { userId: user.id },
  });
};

const deleteResetToken = async (user: any) => {
  return await prisma.passwordResetToken.delete({ where: { userId: user.id } });
};

const verifyResetToken = async (token: string) => {
  return await prisma.passwordResetToken.findFirst({
    where: { token },
  });
};

export default {
  findByEmail,
  findById,
  signin,
  signup,
  saveResetToken,
  verifyResetToken,
  updatePassword,
  checkResetToken,
  deleteResetToken,
};
