import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";
import ParticipantService from "../../services/participant.service.js";

const getLectures = async (req: Request, res: Response) => {
  const lectures = await LectureServices.getLectures(req.user);
  return res.status(200).json({ success: true, lectures });
};

const getLectureById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const lecture = await LectureServices.getLectureById(id as string, req.user);
  return res.status(200).json({ success: true, lecture });
};

const getLectureAccess = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  // check whether the course status is correct and lecture exists
  const lecture = await LectureServices.getLectureById(id as string, user);
 
  if (user.role !== "TEACHER" && lecture.status === "NOT_STARTED")
    return res
      .status(200)
      .json({ isAllowed: false, message: "Lecture is not live" });
  return res
    .status(200)
    .json({ isAllowed: true, role: user.role, status: lecture.status });
};

const joinLecture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const lecture = await LectureServices.joinLecture(id as string, user);
  if (lecture.status !== "STARTED")
    return res
      .status(200)
      .json({ success: false, message: "Lecture not started" });

  // check whether already joined
  await ParticipantService.upsertParticipant(id as string, user);

  return res.status(200).json({ success: true, lecture });
};

const leaveLecture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  await ParticipantService.leaveLecture(id as string, user);
  return res.status(200).json({ message: "Left lecture successfully" });
};

export default {
  getLectureAccess,
  getLectures,
  getLectureById,
  joinLecture,
  leaveLecture,
};
