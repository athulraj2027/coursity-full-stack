import crypto from "crypto";
import { razorpay } from "../lib/razorpay.js";
import CourseRepositories from "../repositories/courses.repositories.js";
import EnrollmentRepositories from "../repositories/enrollment.repositories.js";
import PaymentRepositories from "../repositories/payments.repositories.js";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/prisma.js";
import { EnrollmentNotificationHandler } from "./notification-handlers/enrollment.notification.js";

export interface VerifyPaymentDto {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  courseId: string;
}

const createOrder = async (courseId: string, user: any) => {
  const course = await CourseRepositories.findByIdInternal(courseId);
  if (!course) throw new AppError("Course not found", 400);
  if (!course.isEnrollmentOpen)
    throw new Error("Enrollment is closed for this course");
  if (course.isDeleted) throw new AppError("Course has been deleted", 401);
  if (course.isDisabled)
    throw new AppError("Course is currently disabled", 401);
  const isEnrolledAlready = await EnrollmentRepositories.findEnrolledCourseById(
    user.id,
    courseId,
  );

  if (isEnrolledAlready)
    throw new AppError("You have already enrolled to this course", 300);

  const order = await razorpay.orders.create({
    amount: course.price,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  if (!order) throw new AppError("Couldn't create order", 400);
  const payment = await PaymentRepositories.createOrder(
    user.id,
    courseId,
    course.price,
    order.id,
  );
  if (!payment) throw new AppError("Couldn't create payment", 400);
  return order;
};

const completeEnrollmentAfterPayment = async (
  data: VerifyPaymentDto,
  user: any,
): Promise<{ success: boolean; enrollment_id?: string }> => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    courseId,
  } = data;

  const completeEnrollment = await prisma.$transaction(async (tx) => {
    // 1️⃣ Find payment by Razorpay order ID
    const payment = await tx.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      throw new AppError("Payment record not found", 400);
    }

    // 2️⃣ If already paid, avoid double execution
    if (payment.status === "PAID") {
      return { success: true };
    }

    // 3️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      throw new AppError("Invalid payment signature", 400);
    }

    // 4️⃣ Mark payment as PAID
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    // 5️⃣ Prevent duplicate enrollment
    const existingEnrollment = await tx.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return { success: true };
    }

    // 6️⃣ Create enrollment
    const enrollment = await tx.enrollment.create({
      data: {
        studentId: user.id,
        courseId,
        paymentId: payment.id,
      },
    });

    // 7️⃣ Get course + teacher
    const course = await tx.course.findUnique({
      where: { id: courseId },
      select: {
        teacherId: true,
        price: true,
      },
    });

    if (!course) {
      throw new AppError("Course not found", 400);
    }

    const teacherShare = Math.floor(course.price * 0.8);
    const adminShare = course.price - teacherShare;

    const adminUser = await tx.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      throw new AppError("Platform admin not configured", 500);
    }

    // 8️⃣ Upsert teacher wallet
    const wallet = await tx.wallet.upsert({
      where: { userId: course.teacherId },
      update: {},
      create: {
        userId: course.teacherId,
      },
    });

    // 9️⃣ Credit wallet balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: teacherShare },
      },
    });

    const platformWallet = await tx.wallet.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
      },
    });

    await tx.wallet.update({
      where: { id: platformWallet.id },
      data: {
        balance: { increment: adminShare },
      },
    });

    // 🔟 Create wallet transaction log
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: teacherShare,
        type: "CREDIT",
        description: "Revenue from course enrollment",
        referenceId: payment.id,
      },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: platformWallet.id,
        amount: adminShare,
        type: "CREDIT",
        description: "Platform commission from course sale",
        referenceId: payment.id,
      },
    });

    return { success: true, enrollment_id: enrollment.id, enrollment };
  });
  if (!completeEnrollment || !completeEnrollment.enrollment)
    throw new AppError("Failed to enroll. Please give concern", 400);

  await EnrollmentNotificationHandler.newEnrollmentNotification(
    completeEnrollment.enrollment,
  );
  return completeEnrollment;
};

const getHistory = async () => {};

export default { createOrder, completeEnrollmentAfterPayment, getHistory };
