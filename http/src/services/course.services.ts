import CourseRepositories from "../repositories/courses.repositories.js";
import { AppError } from "../utils/AppError.js";

const getCourses = async (user: any) => {
  switch (user.role) {
    case "ADMIN":
      return CourseRepositories.findAllInternal();
    case "STUDENT":
      return CourseRepositories.findAllPublic();
    case "TEACHER":
      return CourseRepositories.findAllInternalOwnerView(user.id);
  }
};

const getCourseById = async (courseId: string, user: any) => {
  switch (user.role) {
    case "ADMIN":
      return CourseRepositories.findByIdInternal(courseId);
    case "STUDENT":
      return CourseRepositories.findByIdPublic(courseId, user.id);
    case "TEACHER":
      return CourseRepositories.findByIdInternalOwnerView(courseId, user.id);
  }
};

const createCourse = async (
  title: string,
  description: string,
  imageUrl: string,
  price: string,
  startDate: Date,
  user: any,
) => {
  return CourseRepositories.CreateCourseOwnerInternal(
    title,
    description,
    imageUrl,
    price,
    startDate,
    user.id,
  );
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
};
