import express from "express";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./courseRoutes/index.course.routes.js";
import attendanceRoutes from "./attendanceRoutes/index.attendance.routes.js";
import uploadsRoutes from "./upload.routes.js";
import lectureRoutes from "./lectureRoutes/index.lecture.routes.js";
import enrollmentRoutes from "./enrollmentRoutes/enrollment.routes.js";
import paymentRoutes from "./paymentRoutes/payments.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import walletRoutes from "./walletRoutes/wallet.routes.js";
import userRoutes from "./users.routes.js";
import otpRoutes from "./otp.routes.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/courses", courseRoutes);
router.use("/lectures", lectureRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/enrollment", authMiddleware, enrollmentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/payment", authMiddleware, paymentRoutes);
router.use("/dashboard", authMiddleware, dashboardRoutes);
router.use("/wallet", authMiddleware, walletRoutes);
router.use("/users", authMiddleware, roleMiddleware("ADMIN"), userRoutes);

export default router;
