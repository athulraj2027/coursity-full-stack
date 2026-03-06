import express from "express";
import TeacherAttendanceController from "../../../controllers/attendance/teacher.attendance.controller.js";
import { internalAuth } from "../../../middlewares/internal.middleware.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("TEACHER"),
  asyncHandler(TeacherAttendanceController.getAttendance),
);

router.get(
  "/:id/download",
  authMiddleware,
  roleMiddleware("TEACHER"),
  asyncHandler(TeacherAttendanceController.downloadAttendance),
);

router.post(
  "/:id/finalize-attendance",
  internalAuth,
  asyncHandler(TeacherAttendanceController.finalizeAttendanceForLecture),
);

export default router;
