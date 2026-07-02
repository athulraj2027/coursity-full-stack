import AttendanceRepositories from "../repositories/attendance.repositories.js";
import CourseRepositories from "../repositories/courses.repositories.js";
import EnrollmentRepositories from "../repositories/enrollment.repositories.js";
import LectureRepositories from "../repositories/lectures.repositories.js";
import ParticipantRepository from "../repositories/participants.repositories.js";
import { AppError } from "../utils/AppError.js";
import lectureServices from "./lecture.services.js";
const LATE_THRESHOLD_MIN = 10;
const PRESENT_THRESHOLD_PERCENT = 70;

const finalizeAttendance = async (teacherId: string, lectureId: string) => {
  const lecture = await AttendanceRepositories.findLectureWithCourse(lectureId);

  if (!lecture) throw new AppError("Lecture not found", 400);

  if (lecture.course.teacherId !== teacherId)
    throw new AppError("Unauthorized", 403);

  if (lecture.status !== "STARTED")
    throw new AppError("Lecture is not live", 403);

  const lectureEndTime = new Date();

  const lectureDurationSec = Math.floor(
    (lectureEndTime.getTime() - lecture.startTime.getTime()) / 1000,
  );

  const enrollments = await AttendanceRepositories.getEnrollmentsByCourseId(
    lecture.courseId,
  );

  const participants =
    await ParticipantRepository.getParticipantsByLectureId(lectureId);

  const durationMap = new Map<string, number>();

  for (const p of participants) {
    if (p.role !== "STUDENT") continue;

    const leaveTime = p.leaveTime ?? lectureEndTime;

    const sessionDuration = Math.floor(
      (leaveTime.getTime() - p.joinTime.getTime()) / 1000,
    );

    const existing = durationMap.get(p.userId) || 0;
    durationMap.set(p.userId, existing + sessionDuration);
  }

  for (const enrollment of enrollments) {
    const totalDuration = durationMap.get(enrollment.studentId) || 0;

    const attendedPercent =
      lectureDurationSec === 0 ? 0 : (totalDuration / lectureDurationSec) * 100;

    const status =
      attendedPercent >= PRESENT_THRESHOLD_PERCENT
        ? "PRESENT"
        : totalDuration > 0
          ? "LATE"
          : "ABSENT";

    await AttendanceRepositories.upsertAttendance({
      lectureId,
      studentId: enrollment.studentId,
      durationSec: totalDuration,
      status,
    });
  }

  await lectureServices.endLecture(lecture.id, teacherId);
  await ParticipantRepository.closeAllActiveParticipants(
    lectureId,
    lectureEndTime,
  );
  return { message: "Attendance finalized successfully" };
};

const getAttendanceDataForTeacher = async (
  teacherId: string,
  courseId: string,
) => {
  const course = await CourseRepositories.findByIdInternalOwnerView(
    courseId,
    teacherId,
  );

  if (!course) throw new AppError("Course not found", 400);

  const lectures = await LectureRepositories.getAllLecturesForACourse(courseId);

  if (!lectures) throw new AppError("Lectures not found for this course ", 400);

  const enrollments =
    await EnrollmentRepositories.getAllEnrollmentsForACourse(courseId);

  if (!enrollments)
    throw new AppError("No enrollments found for the course", 400);

  const attendance =
    await AttendanceRepositories.getAttendanceForCourse(courseId);

  const attendanceMap = new Map();

  for (const a of attendance) {
    attendanceMap.set(`${a.studentId}-${a.lectureId}`, a);
  }

  // 6️⃣ Build table data
  const table = enrollments.map((enrollment) => {
    const student = enrollment.student;

    const lecturesData = lectures.map((lecture) => {
      const record = attendanceMap.get(`${student.id}-${lecture.id}`);

      return {
        lectureId: lecture.id,
        lectureTitle: lecture.title,
        startTime: lecture.startTime,
        durationSec: record?.durationSec || 0,
        status: record?.status || "ABSENT",
      };
    });

    return {
      studentId: student.id,
      name: student.name,
      email: student.email,
      lectures: lecturesData,
    };
  });

  return {
    course: course.course.title,
    lectures,
    students: table,
  };
};

export default { finalizeAttendance, getAttendanceDataForTeacher };
