import {
  getProfileApi,
  getTeacherProfileApi,
} from "@/services/profile.services";
import { useQuery } from "@tanstack/react-query";

export const useMyProfileQuery = () =>
  useQuery({ queryKey: ["profile"], queryFn: getProfileApi });

export const useTeacherProfileQuery = (id: string) =>
  useQuery({
    queryKey: ["teacher-profile", id],
    queryFn: () => getTeacherProfileApi(id),
    retry: 3,
  });
