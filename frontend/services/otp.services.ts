import { apiRequest } from "@/lib/apiClient";

export const sendOtpApi = async () =>
  apiRequest({ path: "/otp/send", method: "POST" });

export const verifyOtpApi = async (otp: string) =>
  apiRequest({ path: "/otp/verify", method: "POST", body: { otp } });
