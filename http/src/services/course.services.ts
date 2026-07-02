import CourseRepositories from "../repositories/courses.repositories.js";
import { AppError } from "../utils/AppError.js";
import { CourseNotificationHandler } from "./notification-handlers/course.notification.js";

const getCourses = async (user: any) => {
  let courses;
  switch (user.role) {
    case "ADMIN":
      courses = await CourseRepositories.findAllInternal();
    case "STUDENT":
      courses = await CourseRepositories.findAllPublic();
    case "TEACHER":
      courses = await CourseRepositories.findAllInternalOwnerView(user.id);
  }
  return courses;
};

const getTeacherUserId = async (courseId: string) => {
  const IdObject = await CourseRepositories.findTeacherUserId(courseId);
  return IdObject?.teacherId;
};

const getCourseById = async (courseId: string, user: any) => {
  let course;
  switch (user.role) {
    case "ADMIN":
      course = await CourseRepositories.findByIdInternal(courseId);
    case "STUDENT":
      course = await CourseRepositories.findByIdPublic(courseId);
    case "TEACHER":
      course = CourseRepositories.findByIdInternalOwnerView(courseId, user.id);
  }
  if (!course) throw new AppError("Course not found", 404);
  return course;
};

const createCourse = async (
  title: string,
  description: string,
  imageUrl: string,
  price: string,
  startDate: Date,
  user: any,
) => {
  const course = await CourseRepositories.CreateCourseOwnerInternal(
    title,
    description,
    imageUrl,
    price,
    startDate,
    user.id,
  );
  if (!course) throw new AppError("Couldn't create course", 400);
  await CourseNotificationHandler.created(course);
  return course;
};

const patchCourseById = async (courseId: string, user: any, data: any) => {
  switch (user.role) {
    case "ADMIN":
      return CourseRepositories.toggleDisableCourseInternal(courseId, data);
    case "TEACHER":
      return CourseRepositories.patchCourseByOwner(courseId, user.id, data);
  }
};

const editCourseById = async (
  userId: string,
  courseId: string,
  requestBody: any,
) => {
  const course = await CourseRepositories.findByIdInternalOwnerView(
    courseId,
    userId,
  );

  if (!course)
    throw new AppError("You are not authorized to edit this course", 403);
  const updateCourse = await CourseRepositories.editCourse(
    courseId,
    requestBody,
  );

  if (!updateCourse) throw new AppError("Updation failed", 400);
  return updateCourse;
};

export default {
  getCourseById,
  getCourses,
  createCourse,
  patchCourseById,
  editCourseById,
  getTeacherUserId,
};
