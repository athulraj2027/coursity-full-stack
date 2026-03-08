import type { Request, Response } from "express";
import AuthServices from "../../services/auth.services.js";
import generateToken from "../../utils/generateToken.js";

const AuthController = {
  signup: async (req: Request, res: Response) => {
    const { name, email, role, password } = req.body;

    const user = await AuthServices.signupUser(name, email, role, password);
    const token = generateToken(user.id, user.role, user.name, user.isVerified);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? process.env.DOMAIN_URL : "",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  },

  signin: async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const user = await AuthServices.signinUser(email, password, role);
    console.log("user  :", user);
    const token = generateToken(user.id, user.role, user.name, user.isVerified);
    console.log("token : ", token);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? process.env.DOMAIN_URL : "",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  },

  logout: async (req: Request, res: Response) => {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain:  process.env.NODE_ENV === "production" ? process.env.DOMAIN_URL : "",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },

  me: async (req: Request, res: Response) => {
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
  },
};

export default AuthController;
