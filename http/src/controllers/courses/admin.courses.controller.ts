import type { Request, Response } from "express";
import CourseServices from "../../services/course.services.js";

const getCourses = async (req: Request, res: Response) => {
  const courses = await CourseServices.getCourses(req.user);
  return res.status(200).json(courses);
};

const getCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await CourseServices.getCourseById(id as string, req.user);
  return res.status(200).json(course);
};

const patchCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isDisabled = req.body;
  const course = await CourseServices.patchCourseById(
    id as string,
    req.user,
    isDisabled,
  );
  return res.status(200).json(course);
};

export default { getCourses, patchCourse, getCourse };
