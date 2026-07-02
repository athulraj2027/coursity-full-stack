import express from "express";
import notificationController from "../../controllers/notification.controller.js";
const router = express.Router();

router.get("/count", notificationController.getUnreadCount);
router.get("/", notificationController.getAllNotifications);
router.patch("/", notificationController.markAllNotificationsRead);

export default router;
