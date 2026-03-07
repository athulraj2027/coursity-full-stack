import express from "express";
import OtpController from "../../controllers/otp.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  roleMiddleware(["STUDENT", "TEACHER"]),
  OtpController.sendOtp,
);

router.post(
  "/verify",
  authMiddleware,
  roleMiddleware(["STUDENT", "TEACHER"]),
  OtpController.verifyOtp,
);

export default router;
