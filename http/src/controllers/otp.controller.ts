import type { Request, Response } from "express";
import UserServices from "../services/user.services.js";
import generateOtp from "../utils/generateOtp.js";
import OtpRepository from "../repositories/otp.repositories.js";
import { sendEmail } from "../helpers/resend.js";
import UserRepository from "../repositories/users.repositories.js";

const sendOtp = async (req: Request, res: Response) => {
  const user = req.user;
  const dbUser = await UserServices.getUserById(user.id);
  const { resend } = req.body;

  if (dbUser.isVerified)
    return res
      .status(403)
      .json({ success: false, message: "Your account is already verified" });

  if (!resend) {
    const isOtpExist = await OtpRepository.findExistingOtp(user.email);
    if (isOtpExist)
      return res.status(403).json({
        success: false,
        message: "Otp already sent. Please try after 1 min",
      });
  }

  const otp = generateOtp();

  await OtpRepository.createOtp(dbUser.email, otp);
  await sendEmail({
    to: dbUser.email,
    subject: "Your Coursity OTP Code",
    html: `
        <div style="font-family:Arial; padding:20px">
          <h2>Verification code for Coursity account</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#007bff">${otp}</h1>
          <p>This code is valid for 5 minutes.</p>
        </div>
      `,
  });

  return res.status(200).json({ success: true });
};

const verifyOtp = async (req: Request, res: Response) => {
  const user = req.user;
  const { otp } = req.body;

  const dbUser = await UserServices.getUserById(user.id);

  if (dbUser.isVerified)
    return res.status(403).json({
      success: false,
      message: "Your account is already verified",
    });

  // Get latest valid OTP
  const existingOtp = await OtpRepository.findExistingOtp(dbUser.email);

  // Compare OTP
  if (existingOtp.otp !== otp)
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });

  // Mark OTP as used
  await OtpRepository.markOtpAsUsed(existingOtp.id);
  await UserRepository.markVerified(dbUser.id);
  await OtpRepository.deleteOtpsByEmail(dbUser.email);

  return res.status(200).json({
    success: true,
    message: "Account verified successfully",
  });
};

export default { sendOtp, verifyOtp };
