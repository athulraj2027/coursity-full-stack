"use client";
import { useMe } from "@/queries/auth.queries";
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  Hand,
  HandIcon,
} from "lucide-react";
import React, { useState } from "react";

type ControlBarProps = {
  startVideo: (lectureId: string) => Promise<void>;
  stopVideo: () => Promise<void>;
  startMic: (lectureId: string) => Promise<void>;
  stopMic: () => Promise<void>;
  startScreenShare: (lectureId: string) => Promise<void>;
  stopScreenShare: () => Promise<void>;
  leaveRoom: () => void;
  raiseHand: () => void;
  lowerHand: () => void;
  lectureId: string;
};

/* ─── Single Control Button ───────────────────────────────────────────────── */
const ControlBtn = ({
  onClick,
  active,
  danger,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  label: string;
  children: React.ReactNode;
}) => {
  const base = "flex flex-col items-center gap-1.5 group focus:outline-none";

  const iconBase =
    "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-150 border";

  const iconStyle = danger
    ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white"
    : active
      ? "bg-white text-black border-white hover:bg-white/90"
      : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20";

  return (
    <button onClick={onClick} className={base} aria-label={label}>
      <div className={`${iconBase} ${iconStyle}`}>{children}</div>
      <span className="text-[10px] font-medium text-neutral-600 group-hover:text-neutral-400 transition-colors tracking-wide">
        {label}
      </span>
    </button>
  );
};

/* ─── Control Bar ─────────────────────────────────────────────────────────── */
const ControlBar = ({
  startVideo,
  stopVideo,
  startMic,
  stopMic,
  startScreenShare,
  stopScreenShare,
  lectureId,
  leaveRoom,
  lowerHand,
  raiseHand,
}: ControlBarProps) => {
  const { data } = useMe();
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const handleVideoToggle = async () => {
    if (isVideoOn) {
      await stopVideo();
      setIsVideoOn(false);
    } else {
      await startVideo(lectureId);
      setIsVideoOn(true);
    }
  };

  const handleMicToggle = async () => {
    if (isMicOn) {
      await stopMic();
      setIsMicOn(false);
    } else {
      await startMic(lectureId);
      setIsMicOn(true);
    }
  };

  const handleScreenToggle = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      setIsScreenSharing(false);
    } else {
      await startScreenShare(lectureId);
      setIsScreenSharing(true);
    }
  };

  const handleLeave = async () => {
    await leaveRoom();
    window.location.href = `/lecture/left/${lectureId}`;
  };

  const handleHandToggle = async () => {
    if (isHandRaised) {
      await lowerHand();
      setIsHandRaised(false);
    } else {
      await raiseHand();
      setIsHandRaised(true);
    }
  };

  return (
    <div className="shrink-0 flex items-center justify-center gap-3 sm:gap-5 px-4 py-3 border-t border-white/8 bg-neutral-900">
      <ControlBtn
        onClick={handleMicToggle}
        active={isMicOn}
        label={isMicOn ? "Mute" : "Unmute"}
      >
        {isMicOn ? (
          <Mic className="w-4.5 h-4.5" strokeWidth={1.8} />
        ) : (
          <MicOff className="w-4.5 h-4.5" strokeWidth={1.8} />
        )}
      </ControlBtn>

      <ControlBtn
        onClick={handleVideoToggle}
        active={isVideoOn}
        label={isVideoOn ? "Stop Video" : "Start Video"}
      >
        {isVideoOn ? (
          <Video className="w-4.5 h-4.5" strokeWidth={1.8} />
        ) : (
          <VideoOff className="w-4.5 h-4.5" strokeWidth={1.8} />
        )}
      </ControlBtn>

      {/* <ControlBtn
        onClick={handleHandToggle}
        active={isHandRaised}
        label={isHandRaised ? "Lower Hand" : "Raise Hand"}
      >
        {isHandRaised ? (
          <Hand className="w-4.5 h-4.5" strokeWidth={1.8} />
        ) : (
          <HandIcon className="w-4.5 h-4.5" strokeWidth={1.8} />
        )}
      </ControlBtn> */}

      <ControlBtn
        onClick={handleScreenToggle}
        active={isScreenSharing}
        label={isScreenSharing ? "Stop Share" : "Share Screen"}
      >
        {isScreenSharing ? (
          <MonitorOff className="w-4.5 h-4.5" strokeWidth={1.8} />
        ) : (
          <MonitorUp className="w-4.5 h-4.5" strokeWidth={1.8} />
        )}
      </ControlBtn>

      {/* Divider */}
      <div className="w-px h-8 bg-white/8 mx-1 sm:mx-2" />

      <ControlBtn onClick={handleLeave} danger label="Leave">
        <PhoneOff className="w-4.5 h-4.5" strokeWidth={1.8} />
      </ControlBtn>
    </div>
  );
};

export default ControlBar;
