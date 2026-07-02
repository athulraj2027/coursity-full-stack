import UserRepository from "../repositories/users.repositories.js";
import { AppError } from "../utils/AppError.js";

const getUsers = async () => {
  const users = await UserRepository.getAllUsers();
  if (!users) throw new AppError("No users found ", 400);
  return users;
};
const getUserById = async (id: string) => {
  const user = await UserRepository.getUserByIdForAdmin(id);
  if (!user) throw new AppError("No user found", 404);
  return user;
};

const getAdminUserId = async () => await UserRepository.getAdminUserId();

export default { getUserById, getUsers, getAdminUserId };
