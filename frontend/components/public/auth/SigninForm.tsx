"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";
import { areFieldsFilled } from "@/lib/handleFormChange";
import { SIGNIN_FORM_REQUIRED_FIELDS } from "@/constants/authForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { googleAuthApi, SigninResponse } from "@/services/auth.services";
import { toast } from "sonner";

const SigninForm = () => {
  const router = useRouter();
  const { signinUser } = useAuth();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      {isGoogleLoading && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-slate-600 font-medium animate-pulse">
            Authenticating with Google...
          </p>
        </div>
      )}
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

        <div className="w-full">
          <GoogleLogin
            width={324}
            onSuccess={(credentialResponse) => {
              // Start the full-screen loader
              setIsGoogleLoading(true);

              googleAuthApi(credentialResponse.credential)
                .then((res: SigninResponse) => {
                  toast.success("Logged in successfully");
                  router.push(`/${res.role.toLowerCase()}`);
                  // Note: We don't necessarily need to set loading to false
                  // here because the router is redirecting us away.
                })
                .catch((error: { success: boolean; message: string }) => {
                  toast.error(error.message);
                  setIsGoogleLoading(false); // Stop loader on error so user can try again
                });
            }}
            onError={() => {
              toast.error("Google Login Failed");
              setIsGoogleLoading(false);
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default SigninForm;
