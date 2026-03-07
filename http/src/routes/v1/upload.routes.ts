import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import UploadController from "../../controllers/upload.controller.js";
const router = express.Router();

router.post(
  "/cloudinary-signature",
  authMiddleware,
  asyncHandler(UploadController.getCloudinarySignature),
);

export default router;
