"use client";
import { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream | null;
}

export const VideoPlayer = ({ stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("Stream:", stream);

    if (!videoRef.current || !stream) return;

    console.log("Tracks:", stream.getTracks());

    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = () => {
      videoRef.current
        ?.play()
        .catch((err) => console.error("Play failed:", err));
    };
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted // KEEP THIS
      className="w-full h-full object-cover rounded-xl"
      style={{ transform: "scaleX(-1) !important" }}
    />
  );
};
