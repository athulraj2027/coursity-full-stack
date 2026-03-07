import type { Request, Response } from "express";
import UserServices from "../services/user.services.js";
import generateOtp from "../utils/generateOtp.js";
import OtpRepository from "../repositories/otp.repositories.js";
import { sendEmail } from "../helpers/resend.js";
import UserRepository from "../repositories/users.repositories.js";

const OtpController = {
  sendOtp: async (req: Request, res: Response) => {
    const user = req.user;
    console.log("sending otp..");
    const dbUser = await UserServices.getUserById(user.id);

    if (!dbUser)
      return res
        .status(400)
        .json({ success: false, message: "User not found in database" });

    if (dbUser.isVerified)
      return res
        .status(403)
        .json({ success: false, message: "Your account is already verified" });

    console.log("email : ", dbUser.email);
    const isOtpExist = await OtpRepository.findExistingOtp(user.email);
    if (isOtpExist)
      return res.status(403).json({
        success: false,
        message: "Otp already sent. Please try after 1 min",
      });

    const otp = generateOtp();
    // send otp

    const dbOtp = await OtpRepository.createOtp(dbUser.email, otp);

    if (!dbOtp)
      return res
        .status(400)
        .json({ success: false, message: "Failed to create OTP" });

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

    console.log("otp sent");

    return res.status(200).json({ success: true });
  },

  verifyOtp: async (req: Request, res: Response) => {
    const user = req.user;
    const { otp } = req.body;

    const dbUser = await UserServices.getUserById(user.id);

    if (!dbUser)
      return res.status(400).json({
        success: false,
        message: "User not found in database",
      });

    if (dbUser.isVerified)
      return res.status(403).json({
        success: false,
        message: "Your account is already verified",
      });

    // Get latest valid OTP
    const existingOtp = await OtpRepository.findExistingOtp(dbUser.email);

    if (!existingOtp)
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });

    // Compare OTP
    if (existingOtp.otp !== otp)
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });

    // Mark OTP as used
    await OtpRepository.markOtpAsUsed(existingOtp.id);

    // Mark user verified
    await UserRepository.markVerified(dbUser.id);

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  },
};

export default OtpController;
