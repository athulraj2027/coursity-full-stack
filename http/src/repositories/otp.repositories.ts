import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

const createOtp = async (email: string, otp: string) => {
  const dbOtp = await prisma.otp.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 1 minutes
    },
  });
  if (!dbOtp)
    throw new AppError("Failed to create OTP. Please try again.", 400);
};

const findExistingOtp = async (email: string) => {
  const otp = await prisma.otp.findFirst({
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
  if (!otp) throw new AppError("OTP expired or not found", 400);
  return otp;
};

const markOtpAsUsed = async (id: string) => {
  await prisma.otp.update({
    where: { id },
    data: { used: true },
  });
};

const deleteOtpsByEmail = async (email: string) => {
   await prisma.otp.deleteMany({ where: { email } });
};

export default { createOtp, findExistingOtp, markOtpAsUsed, deleteOtpsByEmail };
