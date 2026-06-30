import type { Request, Response } from "express";
import AuthServices from "../../services/auth.services.js";
import generateToken from "../../utils/generateToken.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookie.js";
import { sendEmail } from "../../helpers/resend.js";

const signup = async (req: Request, res: Response) => {
  const { name, email, role, password } = req.body;

  const user = await AuthServices.signupUser(name, email, role, password);
  const token = generateToken(user.id, user.role, user.name, user.isVerified);
  setAuthCookie(res, token);

  return res.status(201).json({
    success: true,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await AuthServices.signinUser(email, password);
  console.log("user  :", user);
  const token = generateToken(user.id, user.role, user.name, user.isVerified);
  console.log("token : ", token);
  setAuthCookie(res, token);
  return res.status(201).json({
    success: true,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

const logout = async (req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const me = async (req: Request, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  const user = await AuthServices.getUserById(userId);
  return res.status(200).json({
    success: true,
    user,
  });
};

const generatePasswordToken = async (req: Request, res: Response) => {
  let user;
  console.log(req.body);
  const { email } = req.body;
  if (!email) {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "No user found",
      });
    }
    user = await AuthServices.getUserById(userId);
  } else user = await AuthServices.getUserByEmail(email);

  if (!user)
    return res.status(401).json({
      success: false,
      message: "Invalid email.Please enter your email address correctly",
    });

  const existingToken = await AuthServices.checkResetToken(user);
  if (existingToken) {
    if (existingToken.expiresAt > new Date()) {
      return res.status(403).json({
        success: false,
        message: "Link already sent. Please wait for 5 mins to request again.",
      });
    } else {
      await AuthServices.deleteResetToken(user);
    }
  }

  const token = await AuthServices.createResetToken(user);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Coursity Account Password Reset",
    html: `
    <h2>Password Reset Request</h2>

    <p>Hello ${user.name},</p>

    <p>Click the button below to reset your password:</p>

    <a
      href="${resetLink}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#4f46e5;
        color:white;
        text-decoration:none;
        border-radius:6px;
      "
    >
      Reset Password
    </a>

    <p>This link will expire in 30 minutes.</p>

    <p>If you didn't request this, you can safely ignore this email.</p>

    <p>Team Coursity</p>
  `,
  });

  return res.status(200).json({
    success: true,
  });
};

const changePassword = async (req: Request, res: Response) => {
  const { password, token } = req.body;
  await AuthServices.verifyResetToken(token, password);
  return res.status(200).json({
    success: true,
  });
};

export default {
  signin,
  signup,
  me,
  logout,
  generatePasswordToken,
  changePassword,
};
