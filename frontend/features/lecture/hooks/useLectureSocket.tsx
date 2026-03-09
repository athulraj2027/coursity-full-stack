/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { toast } from "sonner";

export const useLectureSocket = (
  lectureId: string,
  setExistingUsers: React.Dispatch<React.SetStateAction<any[]>>,
  consume: (producer: any) => void,
  removeProducerById: (producerId: string) => void,
  pauseVideoUI: (producerId: string) => void,
  resumeVideoUI: (producerId: string) => void,
) => {
  useEffect(() => {
    const handleNewUser = (params: { userId: string; username: string }) => {
      console.log("new user joined");
      toast.success(`${params.username} joined the lecture`);

      setExistingUsers((prev) => [...prev, params]);
    };

    const handlePeerLeft = ({
      username,
      socketId,
    }: {
      username: string;
      socketId: string;
    }) => {
      toast.warning(`${username} left the lecture`);

      setExistingUsers((prev) =>
        prev.filter((user: any) => user.username !== username),
      );
    };

    const handleLectureEnded = () => {
      toast.warning("Lecture has ended");

      setTimeout(() => {
        window.location.href = "/lecture/completed";
      }, 1000);
    };

    const handleNewProducer = ({ producer }: any) => {
      console.log("new producer started : ", producer);
      consume(producer);
    };

    const handleProducerPaused = ({ producerId }: { producerId: string }) => {
      console.log("producer paused : ", producerId);
      pauseVideoUI(producerId);
    };
    const handleProducerResumed = ({ producerId }: { producerId: string }) => {
      console.log("producer resumed : ", producerId);
      resumeVideoUI(producerId);
    };
    const handleProducerStopped = ({ producerId }: { producerId: string }) => {
      console.log("producer stopped : ", producerId);
      removeProducerById(producerId);
    };

    socket.on("new-user-joined", handleNewUser);
    socket.on("peer-left", handlePeerLeft);
    socket.on("lecture-ended", handleLectureEnded);
    socket.on("new-producer", handleNewProducer);
    socket.on("producerpaused", handleProducerPaused);
    socket.on("producerresumed", handleProducerResumed);
    socket.on("producerclosed", handleProducerStopped);

    return () => {
      socket.off("new-user-joined", handleNewUser);
      socket.off("peer-left", handlePeerLeft);
      socket.off("lecture-ended", handleLectureEnded);
      socket.off("new-producer", handleNewProducer);
      socket.off("producerpaused", handleProducerPaused);
      socket.off("producerresumed", handleProducerResumed);
      socket.off("producerclosed", handleProducerStopped);
    };
  }, [
    setExistingUsers,
    consume,
    removeProducerById,
    lectureId,
    pauseVideoUI,
    resumeVideoUI,
  ]);
};
