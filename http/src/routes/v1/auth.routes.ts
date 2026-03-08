import express from "express";
import AuthController from "../../controllers/auth/auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import GoogleAuthController from "../../controllers/auth/google.auth.controller.js";

const router = express.Router();

router.post("/signup", asyncHandler(AuthController.signup));
router.post("/signin", asyncHandler(AuthController.signin));
router.post("/google", asyncHandler(GoogleAuthController.googleLogin));
router.post("/logout", authMiddleware, asyncHandler(AuthController.logout));
router.get("/me", authMiddleware, asyncHandler(AuthController.me));

export default router;
