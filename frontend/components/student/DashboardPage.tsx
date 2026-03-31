"use client";

import { useMyDashboardQuery } from "@/queries/auth.queries";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  IndianRupee,
  TrendingUp,
  GraduationCap,
  AlertCircle,
  PlayCircle,
  CircleDot,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface Lecture {
  id: string;
  title: string;
  startTime: string;
  status: string;
}
interface Course {
  id: string;
  title: string;
  price: number;
  teacher: { name: string };
  lectures: Lecture[];
}
interface Payment {
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}
interface Enrollment {
  id: string;
  createdAt: string;
  course: Course;
  payment: Payment;
}
interface DashboardData {
  summary: { totalCourses: number; attendancePercent: number };
  enrollments: Enrollment[];
  upcomingLectures: Lecture[];
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const getCompleted = (lectures: Lecture[]) =>
  lectures.filter((l) => l.status === "COMPLETED").length;

/* ─── Color Palette ───────────────────────────────────────────────────────── */
const colors = {
  violet: {
    bg: "bg-violet-500",
    light: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-600",
  },
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
  },
  sky: {
    bg: "bg-sky-500",
    light: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-600",
  },
};

const accents = [colors.violet, colors.sky, colors.emerald];

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: typeof colors.violet;
}) {
  return (
    <Card
      className={`relative overflow-hidden border ${color.border} bg-white shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${color.bg}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">
              {label}
            </p>
            <p className={`text-3xl font-bold ${color.text}`}>{value}</p>
            {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
          </div>
          <div
            className={`w-9 h-9 rounded-lg ${color.bg} flex items-center justify-center`}
          >
            <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Course Card ─────────────────────────────────────────────────────────── */
function CourseCard({
  enrollment,
  index,
}: {
  enrollment: Enrollment;
  index: number;
}) {
  const accent = accents[index % accents.length];
  const { course, payment, createdAt } = enrollment;

  const done = getCompleted(course.lectures);
  const total = course.lectures.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card
      className={`border ${accent.border} bg-white shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {course.teacher.name}
            </p>
            <h3 className="text-sm font-semibold text-neutral-800 mt-1">
              {course.title}
            </h3>
            <p className={`text-xs font-semibold mt-1 ${accent.text}`}>
              {formatCurrency(payment.amount / 100)}
            </p>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
              payment.status === "PAID"
                ? `${accent.light} ${accent.text} ${accent.border}`
                : "bg-neutral-100 text-neutral-400 border-neutral-200"
            }`}
          >
            {payment.status}
          </span>
        </div>

        {total > 0 && (
          <div>
            <div className="flex justify-between text-[11px] mb-1 text-neutral-500">
              <span>Progress</span>
              <span>
                {done} / {total}
              </span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${accent.bg}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between text-xs text-neutral-500 pt-2 border-t">
          <span>Enrolled {formatDate(createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Lecture Card ────────────────────────────────────────────────────────── */
function LectureCard({ lecture }: { lecture: Lecture }) {
  return (
    <Card className="border border-violet-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CircleDot className="w-3 h-3 text-violet-500" />
              <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                Upcoming
              </span>
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">
              {lecture.title}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {formatDateTime(lecture.startTime)}
            </p>
          </div>
          <PlayCircle className="w-5 h-5 text-violet-500" />
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { data, error, isLoading } = useMyDashboardQuery();
  const dashboard = data as DashboardData | undefined;

  const totalSpent =
    dashboard?.enrollments?.reduce((s, e) => s + (e.payment?.amount ?? 0), 0) ??
    0;
    
  return (
    <div className="min-h-screen bg-slate-50 text-neutral-800">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-7">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-violet-500 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-violet-500 tracking-widest uppercase">
              Student Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            My Dashboard
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track your learning journey & progress
          </p>
        </div>

        {isLoading && <Skeleton className="h-40 w-full" />}

        {error && (
          <Card className="border border-rose-200 bg-rose-50">
            <CardContent className="p-4 flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-4 h-4" />
              Failed to load dashboard
            </CardContent>
          </Card>
        )}

        {dashboard && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                icon={BookOpen}
                label="Courses"
                value={dashboard.summary.totalCourses}
                sub="Active enrollments"
                color={colors.violet}
              />
              <StatCard
                icon={TrendingUp}
                label="Attendance"
                value={`${dashboard.summary.attendancePercent}%`}
                sub="Overall completion"
                color={colors.sky}
              />
              <StatCard
                icon={IndianRupee}
                label="Total Spent"
                value={formatCurrency(totalSpent / 100)}
                sub="Across all courses"
                color={colors.emerald}
              />
            </div>

            {/* Enrollments */}
            <div className="space-y-3">
              <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Enrolled Courses
              </h2>
              {dashboard.enrollments.map((enrollment, i) => (
                <CourseCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  index={i}
                />
              ))}
            </div>

            {/* Upcoming Lectures */}
            {dashboard.upcomingLectures.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Upcoming Lectures
                </h2>
                {dashboard.upcomingLectures.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
