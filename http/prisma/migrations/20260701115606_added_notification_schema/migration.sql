-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_USER_JOINED', 'COURSE_PUBLISHED', 'COURSE_APPROVED', 'COURSE_REJECTED', 'LECTURE_CREATED', 'LECTURE_UPDATED', 'LECTURE_CANCELLED', 'LECTURE_STARTED', 'ASSIGNMENT_CREATED', 'ASSIGNMENT_SUBMITTED', 'ASSIGNMENT_GRADED', 'ENROLLMENT_CREATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'REFUND_COMPLETED', 'ANNOUNCEMENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationEntity" AS ENUM ('COURSE', 'LECTURE', 'ASSIGNMENT', 'PAYMENT', 'ENROLLMENT');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "entityType" "NotificationEntity",
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
