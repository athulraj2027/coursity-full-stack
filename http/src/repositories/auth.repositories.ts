import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";

const AuthRepositories = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || Role.STUDENT,
      },
    });
  },

  async signin(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(userId: string) {
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
  },
};

export default AuthRepositories;
