import {
  getAllLectures,
  getLectureStatus,
  getMyLectureByIdForOwnerApi,
  getMyLecturesForOwnerApi,
  getScheduledLectures,
} from "@/services/lecture.services";
import { useQuery } from "@tanstack/react-query";

export interface Teacher {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  isDeleted: boolean;
  isDisabled: boolean;
  teacher: Teacher;
}

export type LectureStatus = "COMPLETED" | "SCHEDULED" | "LIVE" | "CANCELLED";

export interface Lecture {
  id: string;
  title: string;
  startTime: string;
  status: LectureStatus;
  meetingId: string;
  course: Course;
}

export interface ScheduledLecturesResponse {
  success: boolean;
  lectures: Lecture[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface LectureData {
  id: string;
  title: string;
  startTime: string;
  status: LectureStatus;
  meetingId: string | null;
  isDeleted: boolean;
  courseId: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    price: number;
    startDate: string;
    _count: { enrollments: number; lectures: number };
  };
  attendance: AttendanceRecord[];
  participants: Participant[];
  _count: { attendance: number; participants: number };
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  lectureId: string;
  durationSec: number;
  status: "PRESENT" | "LATE" | "ABSENT";
  student?: Student;
}

export interface Course {
  id: string;
  title: string;
}

export interface Participant {
  id: string;
}

export interface LectureForTeacher {
  id: string;
  title: string;
  startTime: string;
  status: LectureStatus;
  meetingId: string;
  isDeleted: boolean;
  courseId: string;
  createdAt: string;
  course: Course;
  attendance: AttendanceRecord[];
  participants: Participant[];
}

export const useMyLecturesQuery = () =>
  useQuery<LectureForTeacher[]>({
    queryKey: ["my-lectures"],
    queryFn: getMyLecturesForOwnerApi,
  });

export const useMyLectureQueryById = (lectureId: string) =>
  useQuery<LectureData>({
    queryKey: ["my-lecture", lectureId],
    queryFn: () => getMyLectureByIdForOwnerApi(lectureId),
      retry: 3,
  });

export const useScheduledLecturesQuery = () =>
  useQuery<ScheduledLecturesResponse>({
    queryKey: ["lectures"],
    queryFn: getScheduledLectures,
  });

export const useLectureStatusQuery = (lectureId: string) =>
  useQuery({
    queryKey: ["lecture-status"],
    queryFn: () => getLectureStatus(lectureId),
      retry: 3,
  });

export const useAllLecturesQuery = () =>
  useQuery({ queryKey: ["lectures"], queryFn: getAllLectures });
