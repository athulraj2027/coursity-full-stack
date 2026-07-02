import type { Request, Response } from "express";
import { pick } from "../../utils/pick.js";
import CourseServices from "../../services/course.services.js";

const getMyCourses = async (req: Request, res: Response) => {
  const courses = await CourseServices.getCourses(req.user);
  return res.status(200).json(courses);
};

const getMyCourseById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const course = await CourseServices.getCourseById(id as string, req.user);
  return res.status(200).json(course);
};

const createCourse = async (req: Request, res: Response) => {
  const { title, description, imageUrl, price, startDate } = req.body;

  const course = await CourseServices.createCourse(
    title,
    description,
    imageUrl,
    price,
    startDate,
    req.user,
  );

  return res.status(200).json({ success: true, course });
};

const patchCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const allowedFields = [
    "title",
    "description",
    "imageUrl",
    "isEnrollmentOpen",
    "isDeleted",
  ];

  const safeUpdates = pick(updates, allowedFields);

  const course = await CourseServices.patchCourseById(
    id as string,
    req.user,
    safeUpdates,
  );
  return res.status(200).json(course);
};

const editCourse = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  console.log("id : ", id);
  console.log("req body : ", req.body);

  const updatedCourse = await CourseServices.editCourseById(
    user.id,
    id as string,
    req.body,
  );
  return res.status(200).json({ success: true, updatedCourse });
};

export default {
  editCourse,
  patchCourse,
  createCourse,
  getMyCourseById,
  getMyCourses,
};
