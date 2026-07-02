import type { Request, Response } from "express";
import UserServices from "../services/user.services.js";

const getUsers = async (req: Request, res: Response) => {
  const users = await UserServices.getUsers();
  return res.status(200).json({ success: true, users });
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserServices.getUserById(id as string);
  return res.status(200).json({ success: true, user });
};

const blockUser = async () => {};

export default { getUsers, getUserById, blockUser };
