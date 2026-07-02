import type { Role } from "@prisma/client";
import WalletRepository from "../repositories/wallet.repositories.js";
import { AppError } from "../utils/AppError.js";
import { payoutNotificationHandler } from "./notification-handlers/payout.notification.js";

const getWalletTransactionsWithBalance = async (user: {
  id: string;
  role: Role;
}) => {
  const { id } = user;
  const walletTransactionsWithBalance =
    await WalletRepository.getWalletTransactionsWithBalance(id);
  if (!walletTransactionsWithBalance) return null;
  return walletTransactionsWithBalance;
};

const getAllWallets = async (userId: string) => {
  const wallets = await WalletRepository.getAllWalletsRaw();

  const credits = await WalletRepository.getCredits();
  const debits = await WalletRepository.getDebits();
  const refunds = await WalletRepository.getRefunds();

  const creditMap = new Map(credits.map((c) => [c.walletId, c]));
  const debitMap = new Map(debits.map((d) => [d.walletId, d]));
  const refundMap = new Map(refunds.map((r) => [r.walletId, r]));

  return wallets.map((wallet) => {
    const creditData = creditMap.get(wallet.id);
    const debitData = debitMap.get(wallet.id);
    const refundData = refundMap.get(wallet.id);

    return {
      userId: wallet.user.id,
      name: wallet.user.name,
      email: wallet.user.email,
      role: wallet.user.role,

      currentBalance: wallet.balance,

      totalCredits: creditData?._sum.amount || 0,
      totalDebits: Math.abs(debitData?._sum.amount || 0),
      totalRefunds: refundData?._sum.amount || 0,

      lastTransactionAt:
        creditData?._max.createdAt || debitData?._max.createdAt || null,

      lastPayoutAt: debitData?._max.createdAt || null,
    };
  });
};

const payUser = async (
  adminUserId: string,
  amount: number,
  recipientUserId: string,
  payoutProofUrl?: string,
) => {
  if (amount <= 0) {
    throw new AppError("Invalid payout amount", 400);
  }

  const wallet = await WalletRepository.getWalletByUserId(recipientUserId);

  if (!wallet) {
    throw new AppError("No wallet found", 400);
  }

  if (wallet.balance < amount) {
    throw new AppError("Insufficient wallet balance", 400);
  }

  await WalletRepository.payUserWallet(
    wallet.id,
    amount,
    adminUserId,
    payoutProofUrl,
  );

  await payoutNotificationHandler.payoutProcessedNotification(
    recipientUserId,
    amount,
  );
};

export default { getWalletTransactionsWithBalance, getAllWallets, payUser };
