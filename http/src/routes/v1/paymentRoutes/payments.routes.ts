import express from "express";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import studentPaymentsRoutes from "./student.payments.routes.js";
import { isUserVerifiedMiddleware } from "../../../middlewares/isVerified.middleware.js";
const router = express.Router();

router.use(
  "/student",
  roleMiddleware("STUDENT"),
  isUserVerifiedMiddleware,
  studentPaymentsRoutes,
);

export default router;
