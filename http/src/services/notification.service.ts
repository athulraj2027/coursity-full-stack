import * as notificationSocket from "../socket/notification.socket.js";
import notificationRepositories from "../repositories/notification.repositories.js";
import type { NotificationEntity, NotificationType } from "@prisma/client";

interface CreateNotificationDto {
  recipients: string[];
  title: string;
  message: string;
  type: NotificationType;
  entityId?: string;
  entityType?: NotificationEntity;
}
const create = async (data: CreateNotificationDto) => {
  const notifications = data.recipients.map((userId) => ({
    userId,
    title: data.title,
    message: data.message,
    type: data.type,
    entityId: data.entityId,
    entityType: data.entityType,
  }));

  await notificationRepositories.createManyNotifications(notifications);

  // Emit to online users
  for (const userId of data.recipients) {
    notificationSocket.emitToUser(userId, {
      title: data.title,
      message: data.message,
      type: data.type,
      entityId: data.entityId,
      entityType: data.entityType,
    });
  }
};

const getNotifications = async (userId: string) => {
  return await notificationRepositories.getAllNotifications(userId);
};

const markAllRead = async (userId: string) => {
  await notificationRepositories.markAllRead(userId);
};

const getUnreadCount = async (userId: string) => {
  return await notificationRepositories.getUnreadCount(userId);
};

export default { create, getNotifications, markAllRead, getUnreadCount };
