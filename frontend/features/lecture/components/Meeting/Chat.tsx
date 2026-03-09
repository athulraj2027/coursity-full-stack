"use client";

import { useEffect, useRef } from "react";
import { Send } from "lucide-react";

type Message = {
  message: string;
  user: { id?: string; username: string | "You" };
};

type ChatProps = {
  message: string;
  setMessage: (value: string) => void;
  messages: Message[];
  sendMessage: () => void;
};

const Chat = ({ message, setMessage, messages, sendMessage }: ChatProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-neutral-600 font-medium">
              No messages yet
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.user.username === "You";
            return (
              <div
                key={index}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}
                >
                  {/* Sender label */}
                  <span className="text-[10px] font-semibold text-neutral-500 mb-1 px-1">
                    {isOwn ? "You" : msg.user.username || "User"}
                  </span>

                  {/* Bubble */}
                  <div
                    className={`px-3 py-2 text-xs leading-relaxed wrap-break-word rounded-2xl ${
                      isOwn
                        ? "bg-white text-black rounded-br-sm"
                        : "bg-white/8 text-neutral-200 border border-white/8 rounded-bl-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-3 py-3 border-t border-white/8">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 focus-within:border-white/25 transition-colors">
          <input
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder:text-neutral-600 min-w-0"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-white/90 active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-black" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
