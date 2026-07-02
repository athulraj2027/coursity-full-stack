import EnrollmentRepositories from "../repositories/enrollment.repositories.js";
import { AppError } from "../utils/AppError.js";

const getEnrolledCoursesStudent = async (userId: string) => {
  const enrollments = await EnrollmentRepositories.findEnrolledCourses(userId);
  if (!enrollments) throw new AppError("No enrollments found", 404);
  return enrollments;
};

const getEnrolledCourseByIdStudent = async (userId: string, courseId: string) =>
  EnrollmentRepositories.findEnrolledCourseById(userId, courseId);

const getCourseEnrollmentsForOwner = async (courseId: string) =>
  EnrollmentRepositories.getAllEnrollmentsForACourse(courseId);

const getCourseEnrollmentsOfCourseForOwner = async (
  userId: string,
  courseId: string,
) => {};

const getEnrollmentDataById = async (id: string, userId: string) => {
  const enrollment = await EnrollmentRepositories.getEnrollmentById(id, userId);

  if (!enrollment) throw new AppError("Enrollment not found", 400);

  const enrollmentData = await EnrollmentRepositories.enrollmentDataById(
    id,
    userId,
  );
  if (!enrollmentData) throw new AppError("Failed to fetch data", 404);
  return enrollmentData;
};

export default {
  // getCourseEnrollmentsForOwner,
  getCourseEnrollmentsOfCourseForOwner,
  getEnrolledCourseByIdStudent,
  getEnrollmentDataById,
  getEnrolledCoursesStudent,
};
