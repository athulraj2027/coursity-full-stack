import notificationService from "../notification.service.js";

export const payoutNotificationHandler = {
  async payoutProcessedNotification(recipientId: string, amount: number) {
    await notificationService.create({
      title: "Payout processed",
      message: `Of amount ₹${amount}`,
      recipients: [recipientId],
      type: "PAYMENT_SUCCESS",
      entityType: "PAYMENT",
    });
  },
};
