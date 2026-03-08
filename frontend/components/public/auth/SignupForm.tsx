"use client";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { areFieldsFilled } from "@/lib/handleFormChange";
import { SIGNUP_FORM_REQUIRED_FIELDS } from "@/constants/authForm";
import { Loader2, GraduationCap, BookOpen } from "lucide-react";

/* ─── Dark input ──────────────────────────────────────────────────────────── */
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

/* ─── Role option ─────────────────────────────────────────────────────────── */
const RoleOption = ({
  id,
  value,
  label,
  icon: Icon,
  checked,
}: {
  id: string;
  value: string;
  label: string;
  icon: React.ElementType;
  checked: boolean;
}) => (
  <label
    htmlFor={id}
    className={`flex flex-1 items-center gap-2 px-3 py-2.5 rounded-sm border cursor-pointer transition-all duration-150 ${
      checked
        ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-300"
        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
    }`}
  >
    <RadioGroupItem value={value} id={id} className="sr-only" />
    <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
    <span className="text-xs font-semibold">{label}</span>
  </label>
);

/* ─── Main Form ───────────────────────────────────────────────────────────── */
const SignupForm = () => {
  const router = useRouter();
  const { signupUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await signupUser(new FormData(e.currentTarget));
      if (data?.success) {
        console.log("data : ", data);
        router.push(`/${data.role.toLocaleLowerCase()}`);
        router.refresh();
        return;
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const valid = areFieldsFilled(e.currentTarget, SIGNUP_FORM_REQUIRED_FIELDS);
    setIsValid(valid);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
      onChange={handleFormChange}
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Name</DarkLabel>
        <DarkInput
          id="name"
          type="text"
          name="name"
          className="rounded-sm"
          placeholder="John Doe"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Email</DarkLabel>
        <DarkInput
          id="email"
          type="email"
          name="email"
          placeholder="m@example.com"
          required
        />
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>I am a</DarkLabel>
        <RadioGroup
          className="flex gap-2 border-0"
          defaultValue=""
          name="role"
          onValueChange={setSelectedRole}
        >
          <RoleOption
            id="student"
            value="STUDENT"
            label="Student"
            icon={GraduationCap}
            checked={selectedRole === "STUDENT"}
          />
          <RoleOption
            id="teacher"
            value="TEACHER"
            label="Teacher"
            icon={BookOpen}
            checked={selectedRole === "TEACHER"}
          />
        </RadioGroup>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Password</DarkLabel>
        <DarkInput id="password" type="password" name="password" required />
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <DarkLabel>Confirm Password</DarkLabel>
        <DarkInput
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          required
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8 my-1" />

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full h-10 flex items-center justify-center gap-2 rounded-xs bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold tracking-wide transition-all duration-150 shadow-md shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
