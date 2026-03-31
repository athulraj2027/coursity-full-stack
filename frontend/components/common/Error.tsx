"use client";
import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

const Error = ({
  message = "Failed to load. Please try again.",
}: {
  message?: string;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.45)",
      }}
    >
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl ring-1 ring-black/8 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
        {/* Top accent */}
        <div className="h-0.5 bg-red-500 w-full" />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black tracking-tight">
                Something went wrong
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                Please try again
              </p>
            </div>
          </div>

          <div className="h-px bg-black/6" />

          {/* Message */}
          <p className="text-sm text-neutral-600 leading-relaxed text-center">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:bg-red-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
              Retry
            </button>

            <button
              onClick={() => window.history.back()}
              className="flex-1 h-10 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 text-sm font-semibold hover:bg-neutral-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
