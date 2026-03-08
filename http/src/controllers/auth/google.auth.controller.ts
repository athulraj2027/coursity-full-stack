import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import UserRepository from "../../repositories/users.repositories.js";
import generateToken from "../../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const GoogleAuthController = {
  googleLogin: async (req: Request, res: Response) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name;
    const googleId = payload?.sub;

    if (!email || !name)
      return res.status(400).json({
        success: false,
        message: "Credentials missing in payload.Pleasse try again",
      });
    const user = await UserRepository.getUsersByEmail(email);

    if (!user)
      return res.status(403).json({
        success: false,
        message: "New users can't sign in with google.Please sign up first",
      });

    if (!user.isVerified) await UserRepository.markVerified(user.id);

    const auth_token = generateToken(
      user.id,
      user.role,
      user.name,
      user.isVerified,
    );

    res.cookie("auth_token", auth_token, {
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
};

export default GoogleAuthController;
