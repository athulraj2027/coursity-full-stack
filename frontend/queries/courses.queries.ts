import {
  fetchAllCourses,
  fetchAllCoursesForOwner,
  fetchAllCoursesForPublic,
  fetchCourseByIdAdmin,
  fetchCourseByIdForOwner,
  fetchCourseByIdForPublic,
  fetchEnrolledCourseById,
  fetchEnrolledCourses,
  PublicCourse,
} from "@/services/course.services";
import { useQuery } from "@tanstack/react-query";

interface Teacher {
  id: string;
  name: string;
}

interface CourseCount {
  enrollments: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price: number; // in paise
  startDate: string; // ISO date
  teacher: Teacher;
  _count: CourseCount;
  createdAt: string; // ISO date
}

export interface Lecture {
  id: string;
  title: string;
  startTime: string;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED"; // based on your data
  meetingId?: string;
  isDeleted: boolean;
  courseId: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
}

export interface CourseForTeacher {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price: number;
  startDate: string;
  isEnrollmentOpen: boolean;
  isDeleted: boolean;
  isDisabled: boolean;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  lectures: Lecture[];
  enrollments: Enrollment[];
}

export const useMyCoursesQuery = () =>
  useQuery<CourseForTeacher[]>({
    queryKey: ["my-courses"],
    queryFn: fetchAllCoursesForOwner,
  });

export const useMyCourseQueryById = (courseId: string) =>
  useQuery({
    queryKey: ["my-course", courseId],
    queryFn: () => fetchCourseByIdForOwner(courseId),
    retry: 3,
  });

export const useAllCoursesQueryPublic = () =>
  useQuery<Course[]>({
    queryKey: ["all-courses"],
    queryFn: fetchAllCoursesForPublic,
  });

export const useCourseByIdQueryPublic = (courseId: string) =>
  useQuery<PublicCourse>({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseByIdForPublic(courseId),
    retry: 3,
  });

export const useEnrolledCoursesQuery = () =>
  useQuery({ queryKey: ["enrolled-courses"], queryFn: fetchEnrolledCourses });

export const useEnrolledCourseQuery = (courseId: string) =>
  useQuery({
    queryKey: ["enrolled-course", courseId],
    queryFn: () => fetchEnrolledCourseById(courseId),
    retry: 3,
  });

export const useAllCoursesAdminQuery = () =>
  useQuery({ queryKey: ["courses"], queryFn: fetchAllCourses });

export const useCourseByIdQueryAdmin = (courseId: string) =>
  useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseByIdAdmin(courseId),
    retry: 3,
  });
