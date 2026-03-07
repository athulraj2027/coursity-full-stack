"use client";
import { dashboardApi, meApi } from "@/services/auth.services";
import { useQuery } from "@tanstack/react-query";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string; // ISO date string
}

export interface UseMeResponse {
  success: boolean;
  user: User;
}
export const useMe = () =>
  useQuery<UseMeResponse, Error>({
    queryKey: ["me"],
    queryFn: meApi,
    retry: false,
  });

export const useMyDashboardQuery = () =>
  useQuery({ queryKey: ["dashboard"], queryFn: dashboardApi, retry: false });
