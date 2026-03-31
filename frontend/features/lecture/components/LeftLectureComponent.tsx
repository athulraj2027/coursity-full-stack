"use client";

import React from "react";
import { motion } from "motion/react";
import { LogOut, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMe } from "@/queries/auth.queries";
import LectureCompleted from "./LectureCompleted";

const LeftLectureComponent = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data } = useMe();
  const role = data?.user?.role;
  if (role === "TEACHER") return <LectureCompleted />;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="bg-white rounded-3xl border border-black/8 shadow-sm p-8 flex flex-col items-center text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6"
          >
            <LogOut className="w-7 h-7 text-neutral-500" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
            You&apos;ve left the lecture
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            Your attendance has been recorded. You can rejoin if the lecture is
            still ongoing.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 w-full">
            {/* <Button
              onClick={() => router.push(`/lecture/${id}/join`)}
              className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md shadow-violet-200 transition-all duration-200 gap-2"
            >
              Rejoin Lecture
              <ArrowRight className="w-4 h-4" />
            </Button> */}

            <Button
              onClick={() => router.push(`/${role}`)}
              variant="outline"
              className="w-full h-11 rounded-xl border-black/10 text-neutral-600 hover:bg-neutral-50 font-semibold text-sm transition-all duration-200 gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeftLectureComponent;
