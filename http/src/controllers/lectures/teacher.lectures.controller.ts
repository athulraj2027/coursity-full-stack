import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";
import { pick } from "../../utils/pick.js";
import AttendanceService from "../../services/attendance.services.js";
import { LectureNotificationHandler } from "../../services/notification-handlers/lecture.notification.js";

const getAllLectures = async (req: Request, res: Response) => {
  const lectures = await LectureServices.getLectures(req.user);
  return res.status(200).json(lectures);
};

const getLectureById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const lecture = await LectureServices.getLectureById(id as string, req.user);
  return res.status(200).json(lecture);
};

const createLecture = async (req: Request, res: Response) => {
  const { title, startTime, courseId } = req.body;
  const user = req.user;

  const newLecture = await LectureServices.createLecture(
    title,
    startTime,
    courseId,
    user.id,
  );

  return res.json(newLecture);
};

const editLecture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const allowedFields = ["title", "startTime", "isDeleted"];
  const safeUpdates = pick(updates, allowedFields);

  const lecture = await LectureServices.editLecture(
    id as string,
    req.user,
    safeUpdates,
  );
  return res.status(200).json({ success: true, lecture });
};

const startLecture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  await LectureServices.startLecture(id as string, user.id);
  return res.status(200).json({ success: true });
};

const endLecture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  console.log("user ; ", req.user);
  console.log("body : ", req.body);

  await AttendanceService.finalizeAttendance(user.id, id as string);
  return res.status(200).json({ success: true });
};

export default {
  getLectureById,
  getAllLectures,
  createLecture,
  editLecture,
  startLecture,
  endLecture,
};
