"use client";
import { useCourseByIdQueryPublic } from "@/queries/courses.queries";
import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  GraduationCap,
  CheckCircle,
  Lock,
  Video,
  IndianRupee,
  Clock,
  MoveLeftIcon,
} from "lucide-react";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import EnrollBtn from "@/components/student/EnrollBtn";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface CoursePublic {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  startDate: string;
  isEnrollmentOpen: boolean;
  isEnrolled: boolean;
  teacher: { id: string; name: string };
  _count: { lectures: number };
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paise / 100);
  
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* ─── Feature pill ────────────────────────────────────────────────────────── */
const FeaturePill = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-${accent}-50 border border-${accent}-100`}
  >
    <div
      className={`w-8 h-8 rounded-lg bg-${accent}-500 flex items-center justify-center shrink-0`}
    >
      <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
    </div>
    <div>
      <p
        className={`text-[10px] font-bold text-${accent}-600 uppercase tracking-wider`}
      >
        {label}
      </p>
      <p className="text-sm font-bold text-neutral-800">{value}</p>
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const CourseDetailPage = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useCourseByIdQueryPublic(id);
  const [loading, setLoading] = useState(false);

  if (isLoading || loading) return <Loading />;
  if (error || !data) return <Error />;

  const course = data as CoursePublic;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* ── Header ── */}
        <button
          onClick={() => window.history.back()}
          className="
            inline-flex items-center gap-2
            px-4 py-2
            rounded-xl
            text-sm font-semibold
            text-red-600
            bg-red-50
            hover:bg-red-100
            active:scale-95
            transition-all duration-200 mb-6
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
          "
        >
          <MoveLeftIcon size={18} />
          Go Back
        </button>
        <div>
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Course
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-800">
            {course.title}
          </h1>
          <div className="flex items-center gap-1.5 mt-2">
            <GraduationCap
              className="w-3.5 h-3.5 text-violet-500"
              strokeWidth={1.8}
            />
            <p className="text-sm text-neutral-500 font-medium">
              by{" "}
              <Link href={`/student/teacher/profile/${course.teacher.id}`}>
                <span className="text-violet-600 font-semibold">
                  {course.teacher.name}
                </span>
              </Link>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: main content ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Thumbnail */}
            <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-56 sm:h-72 w-full bg-neutral-100 relative overflow-hidden">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen
                      className="w-12 h-12 text-neutral-300"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
                {/* Enrollment status */}
                <span
                  className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                    course.isEnrollmentOpen
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-500 border-black/20"
                  }`}
                >
                  {course.isEnrollmentOpen ? "Enrolling Now" : "Closed"}
                </span>
                {/* Already enrolled */}
                {course.isEnrolled && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-emerald-500 text-white border-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" strokeWidth={2} />
                    Enrolled
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
                <BookOpen
                  className="w-4 h-4 text-violet-500"
                  strokeWidth={1.8}
                />
                <h2 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
                  About This Course
                </h2>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="grid grid-cols-2 gap-3">
              <FeaturePill
                icon={Video}
                label="Completed Lectures"
                value={`${course._count.lectures}`}
                accent="violet"
              />
              <FeaturePill
                icon={Calendar}
                label="Start Date"
                value={fmtDate(course.startDate)}
                accent="sky"
              />
              <FeaturePill
                icon={GraduationCap}
                label="Instructor"
                value={course.teacher.name}
                accent="amber"
              />
              <FeaturePill
                icon={Clock}
                label="Status"
                value={
                  course.isEnrollmentOpen
                    ? "Open for Enrollment"
                    : "Enrollment Closed"
                }
                accent="emerald"
              />
            </div>
          </div>

          {/* ── Right: enroll card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-3">
              <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-0.5 bg-violet-600 w-full" />
                <div className="p-5 space-y-4">
                  {/* Price */}
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1">
                      Course Fee
                    </p>
                    <p className="text-3xl font-bold text-violet-600 tracking-tight">
                      {course.price === 0 ? "Free" : fmtPrice(course.price)}
                    </p>
                  </div>

                  <div className="h-px bg-black/5" />

                  {/* Quick facts */}
                  <div className="space-y-2.5">
                    {[
                      {
                        icon: Video,
                        label: `${course._count.lectures} lectures completed`,
                        color: "text-violet-500",
                      },
                      {
                        icon: Calendar,
                        label: `Starts ${fmtDate(course.startDate)}`,
                        color: "text-sky-500",
                      },
                      {
                        icon: Users,
                        label: "Live interactive sessions",
                        color: "text-emerald-500",
                      },
                      {
                        icon: IndianRupee,
                        label:
                          course.price === 0
                            ? "Completely free"
                            : "One-time payment",
                        color: "text-amber-500",
                      },
                    ].map(({ icon: Icon, label, color }) => (
                      <div key={label} className="flex items-center gap-2.5">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${color}`}
                          strokeWidth={1.8}
                        />
                        <span className="text-xs text-neutral-600 font-medium">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-black/5" />

                  {/* CTA */}
                  {course.isEnrolled ? (
                    <div className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" strokeWidth={2} />
                      Already Enrolled
                    </div>
                  ) : !course.isEnrollmentOpen ? (
                    <div className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-neutral-100 text-neutral-500 text-sm font-semibold border border-black/10 cursor-not-allowed">
                      <Lock className="w-4 h-4" strokeWidth={2} />
                      Enrollment Closed
                    </div>
                  ) : (
                    <EnrollBtn
                      courseId={course.id}
                      setLoadingProp={setLoading}
                    />
                  )}

                  {/* Guarantee note */}
                  {!course.isEnrolled && course.isEnrollmentOpen && (
                    <p className="text-center text-[10px] text-neutral-400 font-medium">
                      Secure payment · Instant access
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
