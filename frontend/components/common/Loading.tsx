import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          {/* Track */}
          <div className="absolute inset-0 rounded-full border-4 border-neutral-100" />
          {/* Spin */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-neutral-700 tracking-tight">
            Loading
          </p>
          <p className="text-[11px] text-neutral-400 font-medium">
            Please wait a moment…
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
