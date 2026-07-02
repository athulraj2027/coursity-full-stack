import type { Lecture } from "@prisma/client";
import enrollmentRepositories from "../../repositories/enrollment.repositories.js";
import notificationService from "../notification.service.js";

const getRecipients = async (courseId: string) => {
  const enrollments =
    await enrollmentRepositories.getAllEnrollmentsForACourse(courseId);
  const recipients = enrollments.map((enrollment) => enrollment.student.id);
  return recipients;
};

export const LectureNotificationHandler = {
  async newLectureCreatedNotification(lecture: Lecture) {
    const recipients = await getRecipients(lecture.courseId);
    if (recipients.length === 0) return;
    await notificationService.create({
      title: "New Lecture scheduled",
      message: `On the topic : ${lecture.title} at ${lecture.startTime}`,
      recipients,
      type: "LECTURE_CREATED",
      entityType: "LECTURE",
    });
  },

  async lectureStartedNotification(lecture: Lecture) {
    const recipients = await getRecipients(lecture.courseId);
    if (recipients.length === 0) return;
    await notificationService.create({
      title: "Lecture Started",
      entityType: "LECTURE",
      message: `On the topic : ${lecture.title}`,
      recipients,
      type: "LECTURE_UPDATED",
    });
  },

  async lectureCompletedNotification(lecture: Lecture) {
    const recipients = await getRecipients(lecture.courseId);
    if (recipients.length === 0) return;
    await notificationService.create({
      title: "Lecture Completed",
      entityType: "LECTURE",
      message: `On the topic : ${lecture.title} `,
      recipients,
      type: "LECTURE_UPDATED",
    });
  },
  async lectureEditedNotification(lecture: Lecture) {
    const recipients = await getRecipients(lecture.courseId);
    if (recipients.length === 0) return;
    await notificationService.create({
      title: "Lecture Rescheduled",
      entityType: "LECTURE",
      message: `On the topic : ${lecture.title}`,
      recipients,
      type: "LECTURE_UPDATED",
    });
  },

  
};
