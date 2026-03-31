import { getUserById, getUsersApi } from "@/services/users.services";
import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = () =>
  useQuery({ queryKey: ["users"], queryFn: getUsersApi });

export const useUserByIdQuery = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    retry: 3,
  });
