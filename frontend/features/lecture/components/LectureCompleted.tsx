"use client";
import React from "react";
import { CheckCircle, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

const LectureCompleted = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Main card */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          {/* Top accent */}
          <div className="h-1 bg-violet-600 w-full" />

          <div className="p-8 flex flex-col items-center text-center gap-6">
            {/* Icon stack */}
            <div className="relative">
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-full bg-violet-50 border-2 border-violet-100 flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                  <CheckCircle className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
              </div>
              {/* Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <Star
                  className="w-3.5 h-3.5 text-white fill-white"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-violet-500 tracking-widest uppercase">
                Session Ended
              </p>
              <h1 className="text-2xl font-bold text-black tracking-tight">
                Lecture Completed!
              </h1>
              <p className="text-sm text-neutral-400 font-medium leading-relaxed max-w-xs">
                Great session. The lecture has been marked as completed and
                attendance has been recorded.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-black/5" />

            {/* Stats row */}
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-violet-50 border border-violet-100">
                <CheckCircle
                  className="w-4 h-4 text-violet-500"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-bold text-violet-700">Done</span>
                <span className="text-[10px] text-violet-400 font-medium">
                  Status
                </span>
              </div>
              {/* <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <Video className="w-4 h-4 text-emerald-500" strokeWidth={1.8} />
                <span className="text-xs font-bold text-emerald-700">Saved</span>
                <span className="text-[10px] text-emerald-400 font-medium">Recording</span>
              </div> */}
              <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-sky-50 border border-sky-100">
                <Star className="w-4 h-4 text-sky-500" strokeWidth={1.8} />
                <span className="text-xs font-bold text-sky-700">Marked</span>
                <span className="text-[10px] text-sky-400 font-medium">
                  Attendance
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2.5">
              <Link
                href="/"
                className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-white border border-black/10 text-neutral-600 text-sm font-semibold hover:bg-neutral-50 transition-all duration-150"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Go Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-neutral-400 font-medium">
          Students can review the session details in their dashboard.
        </p>
      </div>
    </div>
  );
};

export default LectureCompleted;
