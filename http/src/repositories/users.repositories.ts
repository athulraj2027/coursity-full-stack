import { prisma } from "../lib/prisma.js";

const getAllUsers = async () => {
  return prisma.user.findMany();
};

const getUserByIdForAdmin = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      isVerified: true,

      wallet: {
        select: {
          id: true,
          balance: true,
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      },

      _count: {
        select: {
          courses: true, // if teacher
          enrollments: true, // if student
          payments: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    stats: {
      totalCourses: user._count.courses,
      totalEnrollments: user._count.enrollments,
      totalPayments: user._count.payments,
      totalWalletTransactions: user.wallet?._count.transactions ?? 0,
    },
  };
};

const markVerified = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });
};

const getUsersByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const getAdminUserId = async () => {
  const admins =  await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
    select: {
      id: true,
    },
  });
  return admins.map((admin)=>admin.id)
};

export default {
  getAllUsers,
  getUserByIdForAdmin,
  markVerified,
  getUsersByEmail,
  getAdminUserId,
};
