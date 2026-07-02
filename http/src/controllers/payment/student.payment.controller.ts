import type { Request, Response } from "express";
import PaymentServices from "../../services/payment.services.js";

const createOrder = async (req: Request, res: Response) => {
  const { courseId } = req.body;
  const user = req.user;

  const order = await PaymentServices.createOrder(courseId, user);

  return res.status(200).json({
    success: true,
    res: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    },
  });
};

const verifyOrder = async (req: Request, res: Response) => {
  const completeEnrollment =
    await PaymentServices.completeEnrollmentAfterPayment(req.body, req.user);

  return res.status(200).json(completeEnrollment);
};

export default { createOrder, verifyOrder };
