"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { sendOtpApi, verifyOtpApi } from "@/services/otp.services";
import { toast } from "sonner";
import { useMe } from "@/queries/auth.queries";
import Loading from "./Loading";
import { useQueryClient } from "@tanstack/react-query";

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useMe();
  const router = useRouter();
  const [stage, setStage] = useState<"send" | "verify" | "success">("send");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  /* ── Send OTP ── */
  const handleSendOtp = async (resend?: boolean) => {
    try {
      setIsSending(true);
      await sendOtpApi(resend);
      if (stage === "verify") {
        toast.success("Otp has been resent to your email address");
      }
      setResendCooldown(60);
      setStage("verify");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  /* ── Verify OTP ── */
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) return;
    try {
      setIsVerifying(true);
      await verifyOtpApi(code);

      setIsVerifying(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setStage("success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const otpFilled = otp.every((d) => d !== "");
  if (isLoading) return <Loading />;
  if (data?.user.isVerified)
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-sm bg-white rounded-3xl border border-black/8 shadow-sm p-8 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-6"
          >
            <BadgeCheck className="w-7 h-7 text-violet-500" strokeWidth={1.5} />
          </motion.div>

          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Already Verified
          </p>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
            You&apos;re all set
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            Your account is already verified. There&apos;s nothing to do here.
          </p>

          <Button
            onClick={() => router.push(`/${data.user.role.toLowerCase()}`)}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md shadow-violet-200 transition-all duration-200 gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {/* ── Stage 1: Send OTP ── */}
          {stage === "send" && (
            <motion.div
              key="send"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-white rounded-sm border border-black/8 shadow-sm p-8 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-sm bg-violet-50 border border-violet-100 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-violet-500" strokeWidth={1.5} />
              </div>

              {/* Copy */}
              <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
                Account Verification
              </p>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
                Verify your email
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                We will send a one-time code to your registered email address to
                confirm your identity.
              </p>

              <Button
                onClick={() => handleSendOtp()}
                disabled={isSending}
                className="w-full h-11 rounded-sm bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md shadow-violet-200 transition-all duration-200 gap-2"
              >
                {isSending ? (
                  <>
                    <span className="w-4 h-4 rounded-sm border-2 border-white/30 border-t-white animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* ── Stage 2: Enter OTP ── */}
          {stage === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-white rounded-sm border border-black/8 shadow-sm p-8 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-sm bg-violet-50 border border-violet-100 flex items-center justify-center mb-6">
                <ShieldCheck
                  className="w-7 h-7 text-violet-500"
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
                Enter Code
              </p>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                Enter the 6-digit code we just sent to your email address.
              </p>

              {/* OTP boxes */}
              <div className="flex gap-2.5 mb-8" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.3,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className={`
                      w-11 h-13 rounded-sm border-2 text-center text-lg font-bold
                      outline-none transition-all duration-200 caret-transparent
                      ${
                        digit
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-neutral-200 bg-neutral-50 text-neutral-900 focus:border-violet-400 focus:bg-white"
                      }
                    `}
                  />
                ))}
              </div>

              {/* Verify button */}
              <Button
                onClick={handleVerify}
                disabled={!otpFilled || isVerifying}
                className="w-full h-11 rounded-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-semibold text-sm shadow-md shadow-violet-200 transition-all duration-200 gap-2"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 rounded-sm border-2 border-white/30 border-t-white animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Verify Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              {/* Resend */}
              <button
                disabled={resendCooldown > 0}
                onClick={() => {
                  setOtp(Array(OTP_LENGTH).fill(""));
                  handleSendOtp(true);
                }}
                className={`
          mt-4 flex items-center gap-1.5 text-xs font-medium transition-colors duration-200
          ${
            resendCooldown > 0
              ? "text-neutral-300 cursor-not-allowed"
              : "text-neutral-400 hover:text-violet-600 cursor-pointer"
          }
        `}
              >
                <RotateCcw
                  className={`w-3 h-3 ${resendCooldown > 0 ? "opacity-40" : ""}`}
                />
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Resend code"}
              </button>
            </motion.div>
          )}

          {/* ── Stage 3: Success ── */}
          {stage === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-white rounded-sm border border-black/8 shadow-sm p-8 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.15,
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="w-16 h-16 rounded-sm bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6"
              >
                <CheckCircle2
                  className="w-7 h-7 text-emerald-500"
                  strokeWidth={1.5}
                />
              </motion.div>

              <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
                All Done
              </p>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">
                Account verified!
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                Your email has been confirmed. You now have full access to your
                account.
              </p>

              <Button
                onClick={() => router.replace("/")}
                className="w-full h-11 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 transition-all duration-200"
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifyOtp;
