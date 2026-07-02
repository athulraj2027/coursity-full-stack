// course.notification.ts

import type { Course } from "@prisma/client";
import userServices from "../user.services.js";
import notificationService from "../notification.service.js";

export const CourseNotificationHandler = {
  async created(course: Course) {
    const adminIds = await userServices.getAdminUserId();

    await notificationService.create({
      title: "New Course created",
      message: `${course.title} has been created`,
      recipients: adminIds,
      type: "COURSE_PUBLISHED",
      entityId: "",
      entityType: "COURSE",
    });
  },
};
