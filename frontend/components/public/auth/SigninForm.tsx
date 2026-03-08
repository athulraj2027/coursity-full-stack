"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { areFieldsFilled } from "@/lib/handleFormChange";
import { SIGNIN_FORM_REQUIRED_FIELDS } from "@/constants/authForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Loader2, Sun } from "lucide-react";
import { googleAuthApi } from "@/services/auth.services";
import { toast } from "sonner";

const DarkLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
    {children}
  </label>
);

const RoleOption = ({
  id,
  value,
  label,
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
    {/* <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} /> */}
    <span className="text-xs font-semibold">{label}</span>
  </label>
);

const SigninForm = () => {
  const router = useRouter();
  const { signinUser } = useAuth();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await signinUser(new FormData(e.currentTarget));
      if (data.success) {
        router.push(`/${data.role.toLowerCase()}`);
        router.refresh();
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const valid = areFieldsFilled(e.currentTarget, SIGNIN_FORM_REQUIRED_FIELDS);
    setIsValid(valid);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onChange={handleFormChange}
      onSubmit={onSubmit}
    >
      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          name="email"
          required
          className="bg-white/8 border-white/10 text-white placeholder:text-slate-600  focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50"
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
          <RoleOption
            id="admin"
            value="ADMIN"
            label="Admin"
            icon={Sun}
            checked={selectedRole === "ADMIN"}
          />
        </RadioGroup>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          className="bg-white/8 border-white/10 text-white placeholder:text-slate-600  focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/50"
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-2.5 mt-1">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-sm bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold border border-indigo-500 transition-all duration-150 shadow-md shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing you in…
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            googleAuthApi(credentialResponse.credential)
              .then(() => router.push("/"))
              .catch((error: { success: boolean; message: string }) =>
                toast.error(error.message),
              );
          }}
        />
      </div>
    </form>
  );
};

export default SigninForm;
