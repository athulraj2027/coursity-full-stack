import type { Role } from "@prisma/client";
import CourseRepositories from "../repositories/courses.repositories.js";
import LectureRepositories from "../repositories/lectures.repositories.js";
import { AppError } from "../utils/AppError.js";
import { LectureNotificationHandler } from "./notification-handlers/lecture.notification.js";

const getLectures = async (user: any) => {
  let lectures;
  switch (user.role) {
    case "ADMIN":
      lectures = await LectureRepositories.findAllInternal();
    case "TEACHER":
      lectures = await LectureRepositories.findAllOwner(user.id);
    case "STUDENT":
      lectures = await LectureRepositories.findAllStudentLectures(user.id);
  }
  if (!lectures) throw new AppError("Lectures not found", 404);
  return lectures;
};

const getLectureById = async (lectureId: string, user: any) => {
  let lecture;
  switch (user.role) {
    case "ADMIN":
      lecture = await LectureRepositories.findByIdInternal(lectureId);
    case "TEACHER":
      lecture = await LectureRepositories.findByIdOwner(user.id, lectureId);
    case "STUDENT":
      lecture = await LectureRepositories.findByIdStudent(user.id, lectureId);
  }
  if (!lecture) throw new AppError("No lecture found", 404);
  return lecture;
};

const createLecture = async (
  title: string,
  startTime: Date,
  courseId: string,
  userId: string,
) => {
  const ownsCourse = await CourseRepositories.isCourseOwnedByUser(
    userId,
    courseId,
  );
  if (!ownsCourse) throw new AppError("You do not own this course", 403);
  return LectureRepositories.createByInternalOwner(title, startTime, courseId);
};

const editLecture = async (lectureId: string, user: any, updates: any) => {
  const lecture = await LectureRepositories.findByIdOwner(user.id, lectureId);
  if (!lecture) throw new AppError("Lecture not found", 400);
  if (lecture.status !== "NOT_STARTED")
    throw new AppError("Only lectures not started is allowed to edit", 403);
  let edited = await LectureRepositories.updateLectureOwner(
    lectureId,
    user.id,
    updates,
  );
  if (!edited) throw new AppError("Couldn't update lecture", 401);
  return edited;
};

const startLecture = async (lectureId: string, userId: string) => {
  const lecture = await LectureRepositories.findByIdOwner(userId, lectureId);
  if (!lecture) throw new AppError("No lecture found", 400);

  if (lecture.status !== "NOT_STARTED")
    throw new AppError("Lecture can't be started again", 403);
  const now = new Date();

  if (lecture.startTime) {
    const startTime = new Date(lecture.startTime);

    const tenMinutesBefore = new Date(startTime.getTime() - 10 * 60 * 1000);
    const twentyMinutesAfter = new Date(startTime.getTime() + 20 * 60 * 1000);

    const canStart = now >= tenMinutesBefore && now <= twentyMinutesAfter;

    if (!canStart)
      throw new AppError(
        "Lecture can only be started from 10 minutes before to 20 minutes after the scheduled time.",
        403,
      );
  }
  await LectureRepositories.startLectureOwner(lecture.id);
  await LectureNotificationHandler.lectureStartedNotification(lecture);
};

const endLecture = async (lectureId: string, userId: string) => {
  const lecture = await LectureRepositories.findByIdOwner(userId, lectureId);
  if (!lecture) throw new AppError("No lecture found", 400);
  if (lecture.status !== "STARTED")
    throw new AppError("Lecture is not started", 403);
  // update attendance
  await LectureRepositories.endLectureOwner(lectureId);
  await LectureNotificationHandler.lectureCompletedNotification(lecture);
};

const joinLecture = async (
  lectureId: string,
  user: { userId: string; role: Role },
) => {
  const { userId } = user;
  let lecture;
  switch (user.role) {
    case "ADMIN":
      lecture = await LectureRepositories.findByIdInternal(lectureId);
    case "STUDENT":
      lecture = await LectureRepositories.findByIdStudent(userId, lectureId);
  }
  if (!lecture) throw new AppError("No lecture found", 404);
  return lecture;
};

export default {
  getLectureById,
  getLectures,
  createLecture,
  editLecture,
  startLecture,
  endLecture,
  joinLecture,
};
