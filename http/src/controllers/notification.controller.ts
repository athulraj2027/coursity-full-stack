import type { Request, Response } from "express";
import notificationService from "../services/notification.service.js";

const getAllNotifications = async (req: Request, res: Response) => {
  const { user } = req.user;
  const notifications = await notificationService.getNotifications(user.id);
  return res.status(200).json({ success: true, notifications });
};

const markAllNotificationsRead = async (req: Request, res: Response) => {
  const { user } = req.user;
  await notificationService.markAllRead(user.id);
  return res.status(200).json({ success: true });
};

const getUnreadCount = async (req: Request, res: Response) => {
  const { user } = req.user;
  const count = await notificationService.getUnreadCount(user.id);
  return res.status(200).json({ success: true, count });
};

export default {
  getAllNotifications,
  markAllNotificationsRead,
  getUnreadCount,
};
