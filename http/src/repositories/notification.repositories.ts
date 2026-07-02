import { prisma } from "../lib/prisma.js";

const createManyNotifications = async (data: any) => {
  await prisma.notification.createMany({ data });
};

const getAllNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const markAllRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { userId },
    data: { isRead: true },
  });
};

const getUnreadCount = async (userId: string) => {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
};

export default {
  createManyNotifications,
  markAllRead,
  getAllNotifications,
  getUnreadCount,
};
