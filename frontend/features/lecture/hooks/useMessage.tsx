"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type MessagePayload = {
  message: string;
  lectureId?: string;
  user: { id?: string; username: string | "You" };
};

export const useMessage = (lectureId: string) => {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload: MessagePayload = {
      message,
      lectureId,
      user: { username: "You" },
    };

    socket.emit("send-message", payload);
    setMessages((prev) => [...prev, payload]);
    setMessage("");
  };

  useEffect(() => {
    const handleIncomingMessage = (data: MessagePayload) => {
      console.log("message received : ", data);
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive-message", handleIncomingMessage);

    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [lectureId]);

  return { message, setMessage, messages, sendMessage };
};
