import { prisma } from "../lib/prisma.js";

const UserRepository = {
  getAllUsers() {
    return prisma.user.findMany();
  },

  async getUserByIdForAdmin(id: string) {
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
  },

  async markVerified(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  },

  async getUsersByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },
};

export default UserRepository;
