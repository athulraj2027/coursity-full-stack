"use client";
import { FORGOT_PASSWORD_REQUIRED_FIELDS } from "@/constants/authForm";
import { useAuth } from "@/hooks/useAuth";
import { areFieldsFilled } from "@/lib/handleFormChange";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const DarkInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full h-10 px-3.5 rounded-sm bg-white/8 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-150"
  />
);

/* ─── Dark label ──────────────────────────────────────────────────────────── */
const DarkLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
    {children}
  </label>
);

const ForgotPasswordCard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { createResetLink } = useAuth();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createResetLink(new FormData(e.currentTarget));
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const valid = areFieldsFilled(
      e.currentTarget,
      FORGOT_PASSWORD_REQUIRED_FIELDS,
    );
    setIsValid(valid);
  };
  
  return (
    <div className="w-full mt-20 sm:mt-0">
      <div className=" backdrop-blur-xl border border-white/10 rounded-sm p-7 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Enter your email to verify identity
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} onChange={handleFormChange}>
          <div className="flex flex-col gap-1.5">
            <DarkLabel>Email</DarkLabel>
            <DarkInput
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
             
            />
          </div>
          <div className="h-px bg-white/8 my-1" />
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full h-10 flex items-center justify-center gap-2 rounded-xs bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold tracking-wide transition-all duration-150 shadow-md shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Link...
              </>
            ) : (
              "Send Link"
            )}
          </button>
        </form>
        {/* Footer */}
      </div>
    </div>
  );
};

export default ForgotPasswordCard;
