import { apiRequest } from "@/lib/apiClient";
import { UseMeResponse } from "@/queries/auth.queries";

type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface SigninResponse {
  success: boolean;
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface SignupResponse {
  success: boolean;
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

export const signupApi = (data: {
  name: string;
  email: string;
  role: Role;
  password: string;
}) =>
  apiRequest<SignupResponse | ErrorResponse, typeof data>({
    path: "/auth/signup",
    method: "POST",
    body: data,
  });

export const signinApi = (data: {
  email: string;
  role: Role;
  password: string;
}) =>
  apiRequest<SigninResponse, typeof data>({
    path: "/auth/signin",
    method: "POST",
    body: data,
  });

export const logoutApi = () =>
  apiRequest({
    path: "/auth/logout",
    method: "POST",
  });

export const meApi = (): Promise<UseMeResponse> =>
  apiRequest<UseMeResponse>({
    path: "/auth/me",
  });

export const dashboardApi = () =>
  apiRequest({ path: "/dashboard", method: "GET" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const googleAuthApi = (token: any) =>
  apiRequest<SigninResponse, typeof token>({
    path: "/auth/google",
    method: "POST",
    body: { token },
  });
