import { apiRequest } from "@/lib/apiClient";

export const sendOtpApi = async (resend?: boolean) =>
  apiRequest({ path: "/otp/send", method: "POST", body: { resend } });

export const verifyOtpApi = async (otp: string) =>
  apiRequest({ path: "/otp/verify", method: "POST", body: { otp } });
