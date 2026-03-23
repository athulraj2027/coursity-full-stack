"use client";

import { Eye, Pencil, Play, X } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CancelLectureCard from "./CancelLectureCard";
import Link from "next/link";

type ModalType = "CANCEL" | "START";

const LectureActions = ({
  lectureId,
  startingTime,
  status,
}: {
  lectureId: string;
  startingTime: Date;
  status: "NOT_STARTED" | "STARTED" | "COMPLETED";
}) => {
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => {
    if (type === "START") {
      window.open(`/lecture/${lectureId}`, "_blank");
      return;
    }
    setModalType(type);
    setModal(true);
  };

  const canStartLecture = () => {
    if (!startingTime) return false;
    const now = new Date();
    const start = startingTime;
    const tenMinutesBefore = start.getTime() - 10 * 60 * 1000;
    const twentyMinutesAfter = start.getTime() + 20 * 60 * 1000;
    return (
      now.getTime() >= tenMinutesBefore && now.getTime() <= twentyMinutesAfter
    );
  };

  const canStart = status === "NOT_STARTED" && canStartLecture();
  const canCancel = status === "NOT_STARTED";

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center justify-center gap-1">
          {/* VIEW */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/teacher/my-lectures/${lectureId}`}>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/10 bg-white text-neutral-500 hover:text-black hover:border-black/25 hover:bg-neutral-50 transition-all duration-150">
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="text-xs">View lecture</TooltipContent>
          </Tooltip>

          {/* START */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => openModal("START")}
                disabled={!canStart}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed bg-blue-500 border-black text-white hover:bg-blue-400 active:bg-blue-500"
              >
                <Play className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              {!canStart && status === "NOT_STARTED"
                ? "Available 10 min before start"
                : status !== "NOT_STARTED"
                  ? "Lecture already started or completed"
                  : "Start lecture"}
            </TooltipContent>
          </Tooltip>

          {/* EDIT */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/teacher/my-lectures/${lectureId}/edit`}>
                <button
                  disabled
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-black/10 bg-white text-neutral-400 hover:text-black hover:border-black/25 hover:bg-neutral-50 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Edit lecture</TooltipContent>
          </Tooltip>

          {/* CANCEL */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => openModal("CANCEL")}
                disabled={!canCancel}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-200 bg-red-50 text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Cancel lecture</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {modal && modalType && (
        <CancelLectureCard
          lectureId={lectureId}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
};

export default LectureActions;
