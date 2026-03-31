"use client";
import Loading from "../../../components/common/Loading";
import NoAccess from "./NoAccess";
import StartLectureBtn from "./StartLectureBtn";
import JoinLectureBtn from "./JoinLectureBtn";
import Meeting from "./Meeting/Meeting";
import { useLectureAccess } from "../hooks/useLectureAccess";
import { useSocketStatus } from "../hooks/useSocketStatus";
import { Video, Wifi, WifiOff, Radio } from "lucide-react";
import LectureCompleted from "./LectureCompleted";

const LecturePageComponent = ({ lectureId }: { lectureId: string }) => {
  const { isLoading, mode, setMode, role, error, lectureStatus } =
    useLectureAccess(lectureId);
  const { isConnected, transport } = useSocketStatus();

  const handleEnter = async () => {
    setMode("MEETING");
  };

  if (lectureStatus === "COMPLETED") return <LectureCompleted />;
  if (error) return <NoAccess error={error} />;
  if (isLoading || !role) return <Loading />;

  if (mode === "MEETING" || (lectureStatus === "STARTED" && role === "TEACHER"))
    return <Meeting lectureId={lectureId} role={role} />;

  const isTeacher = role === "TEACHER";

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-0.5 bg-black w-full" />

        <div className="p-8 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-sm">
            <Video className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <div>
            <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1.5">
              {isTeacher ? "Teacher Portal" : "Student Portal"}
            </p>
            <h1 className="text-xl font-bold text-black tracking-tight">
              {isTeacher ? "Start Your Lecture" : "Join Lecture"}
            </h1>
            <p className="text-sm text-neutral-400 font-medium mt-1.5 leading-relaxed">
              {isTeacher
                ? "You are about to begin the live session."
                : "You are about to enter the live lecture."}
            </p>
          </div>

          {/* CTA Button */}
          <div className="w-full">
            {isTeacher ? (
              <StartLectureBtn
                onStart={handleEnter}
                lectureId={lectureId}
                isConnected={isConnected}
              />
            ) : (
              <JoinLectureBtn
                onStart={handleEnter}
                lectureId={lectureId}
                isConnected={isConnected}
              />
            )}
          </div>

          {/* Connection Status */}
          <div className="w-full border-t border-black/5 pt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              {isConnected ? (
                <Wifi className="w-3.5 h-3.5 text-black" strokeWidth={1.8} />
              ) : (
                <WifiOff
                  className="w-3.5 h-3.5 text-neutral-400"
                  strokeWidth={1.8}
                />
              )}
              <span
                className={`text-[11px] font-semibold ${isConnected ? "text-black" : "text-neutral-400"}`}
              >
                {isConnected ? "Connected" : "Not connected"}
              </span>
            </div>

            <div className="w-px h-3 bg-black/10" />

            <div className="flex items-center gap-1.5">
              <Radio
                className={`w-3.5 h-3.5 ${transport ? "text-black" : "text-neutral-400"}`}
                strokeWidth={1.8}
              />
              <span
                className={`text-[11px] font-semibold ${transport ? "text-black" : "text-neutral-400"}`}
              >
                {transport ? "Transport ready" : "No transport"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePageComponent;
