import type { Enrollment } from "@prisma/client";
import courseServices from "../course.services.js";
import notificationService from "../notification.service.js";

export const EnrollmentNotificationHandler = {
  async newEnrollmentNotification(enrollment: Enrollment) {
    const teacherId = await courseServices.getTeacherUserId(
      enrollment.courseId,
    );

    const course = await courseServices.getCourseById(
      enrollment.courseId,
      "TEACHER",
    );
    if (!course || !teacherId) return;

    await notificationService.create({
      title: "New student enrolled",
      message: `A new student has been enrolled to your course`,
      recipients: [teacherId],
      type: "ENROLLMENT_CREATED",
      entityId: "",
      entityType: "ENROLLMENT",
    });
  },
};
