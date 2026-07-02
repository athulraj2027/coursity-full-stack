import type { Request, Response } from "express";
import EnrollmentServices from "../../services/enrollment.services.js";

const getEnrolledCourses = async (req: Request, res: Response) => {
  const courses = await EnrollmentServices.getEnrolledCoursesStudent(
    req.user.id,
  );
  return res.status(200).json({ success: true, courses });
};

const getEnrollmentData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const enrollmentData = await EnrollmentServices.getEnrollmentDataById(
    id as string,
    user.id,
  );

  return res.status(200).json({ success: true, enrollmentData });
};

const getEnrolledCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await EnrollmentServices.getEnrolledCourseByIdStudent(
    req.user.id,
    id as string,
  );

  return res.status(200).json({ success: true, course });
};

export default { getEnrolledCourseById, getEnrollmentData, getEnrolledCourses };
