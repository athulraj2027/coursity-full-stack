import type { Request, Response } from "express";
import WalletServices from "../services/wallet.services.js";

const getWalletTransactions = async (req: Request, res: Response) => {
  const user = req.user;
  const walletTransactionsWithBalance =
    await WalletServices.getWalletTransactionsWithBalance(user);
  return res.status(200).json({ success: true, walletTransactionsWithBalance });
};

const getAllWallets = async (req: Request, res: Response) => {
  const walletsData = await WalletServices.getAllWallets(req.user.id);
  if (!walletsData)
    return res.status(400).json({ success: false, message: "Data not found" });
  return res.status(200).json({ success: true, walletsData });
};

const payUser = async (req: Request, res: Response) => {
  const { amount, userId, imageUrl } = req.body;

  await WalletServices.payUser(
    req.user.id, // admin ID
    amount,
    userId, // teacher ID
    imageUrl,
  );

  return res.status(200).json({ success: true });
};

export default { getWalletTransactions, getAllWallets, payUser };
