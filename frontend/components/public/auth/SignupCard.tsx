"use client";
import React from "react";
import Link from "next/link";

import SignupForm from "./SignupForm";

const SignupCard = () => {
  return (
    <div className="w-full  mt-20 sm:mt-0">
      {/* Card */}
      <div className=" backdrop-blur-xl border border-white/10 rounded-sm p-7 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Enter your details to get started
            </p>
          </div>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-5 font-medium">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupCard;
