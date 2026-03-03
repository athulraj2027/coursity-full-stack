import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-slate-950">
      {/* ── Background grid ── */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Color blobs ── */}
      <div className="absolute top-[-10%] right-[-5%] w-120 h-120 rounded-full bg-indigo-600 opacity-20 blur-[100px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-100 h-100 rounded-full bg-blue-500 opacity-15 blur-[100px]" />
      <div className="absolute top-[40%] left-[40%] w-75 h-75 rounded-full bg-violet-600 opacity-10 blur-[80px]" />

      <div className="relative z-10 container mx-auto max-w-5xl px-6 py-24 sm:py-32">
        {/* ── Eyebrow ── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Real-time learning platform
          </div>
        </div>

        {/* ── Headline ── */}
        <h1 className="text-center tracking-tight">
          {/* Hero word — fluid type scale */}
          <span className="block font-bold leading-17.5 tracking-[-0.04em] text-6xl">
            <span className="text-white">From Lecture to Report,</span>
            <br />
            <span className="text-white"> Without the Chaos</span>
          </span>
        </h1>

        {/* ── Subtext ── */}
        <p className="mt-8 text-center text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
          <span className="text-slate-200 font-medium">
            The Operating System for Online Teaching
          </span>
          <span className="text-slate-200 font-medium">
            {" "}
            <br />
            Run live classes, track attendance,and understand your students
          </span>{" "}
          <br />— all in one place.
        </p>

        {/* ── CTAs ── */}
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/sign-up">
            <button className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-all duration-200">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </Link>
        </div>

        {/* ── Hairline divider ── */}
        <div className="mt-16 flex items-center justify-center">
          <div className="h-px w-24 bg-linear-to-r from-transparent to-slate-700" />
          <div className="h-px w-20 bg-slate-700" />
          <div className="h-px w-24 bg-linear-to-l from-transparent to-slate-700" />
        </div>

        {/* ── Trust badges ── */}
        <div className="mt-8 flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
          {[
            {
              label: "Role-based access",
            },
            { label: "Real-time video" },
            { label: "Auto attendance" },
          ].map(({ label }) => (
            <div
              key={label}
              className="flex items-center gap-2 group cursor-default"
            >
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-[0.15em] transition-colors duration-200">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
