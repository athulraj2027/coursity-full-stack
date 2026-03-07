import { prisma } from "../lib/prisma.js";

const OtpRepository = {
  createOtp: async (email: string, otp: string) => {
    return await prisma.otp.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 1 minutes
      },
    });
  },

  findExistingOtp: async (email: string) => {
    return await prisma.otp.findFirst({
      where: {
        email,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  markOtpAsUsed: async (id: string) => {
    return await prisma.otp.update({
      where: { id },
      data: { used: true },
    });
  },
};

export default OtpRepository;
