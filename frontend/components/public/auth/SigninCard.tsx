import React from "react";
import Link from "next/link";
import SigninForm from "./SigninForm";

const SigninCard = () => {
  return (
    <div className="w-full">
      {/* Logo */}

      {/* Card */}
      <div className=" backdrop-blur-xl border border-white/10 rounded-sm p-7 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Enter your credentials to sign in
            </p>
          </div>
        </div>

        {/* Form */}
        <SigninForm />

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-5 font-medium">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninCard;
