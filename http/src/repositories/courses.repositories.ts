import { prisma } from "../lib/prisma.js";

const CreateCourseOwnerInternal = async (
  title: string,
  description: string,
  imageUrl: string,
  priceString: string,
  startDate: Date,
  userId: string,
) => {
  return prisma.course.create({
    data: {
      title,
      description,
      imageUrl,
      price: Number(priceString) * 100,
      startDate,
      teacherId: userId,
    },
  });
};

// Full data (admin / internal use)
const findAllInternal = async () => {
  return prisma.course.findMany({
    include: {
      teacher: {
        select: { id: true, name: true, email: true },
      },
      enrollments: true,
      lectures: true,
    },
  });
};

const isCourseOwnedByUser = async (userId: string, courseId: string) => {
  return prisma.course.findFirst({
    where: {
      id: courseId,
      teacherId: userId,
      isDeleted: false,
    },
    select: { id: true },
  });
};

// Public-safe course list
const findAllPublic = async () => {
  return prisma.course.findMany({
    where: {
      isDeleted: false,
      isDisabled: false,
      isEnrollmentOpen: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      startDate: true,

      teacher: {
        select: {
          id: true,
          name: true,
        },
      },

      _count: {
        select: {
          enrollments: true,
        },
      },

      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Full single course view
const findByIdInternal = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      startDate: true,
      isEnrollmentOpen: true,
      isDeleted: true,
      isDisabled: true,
      createdAt: true,
      updatedAt: true,

      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          wallet: {
            select: {
              balance: true,
            },
          },
        },
      },

      lectures: {
        select: {
          id: true,
          title: true,
          startTime: true,
          status: true,
          meetingId: true,
          _count: {
            select: {
              participants: true,
              attendance: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      },

      _count: {
        select: {
          enrollments: true,
          payments: true,
        },
      },
    },
  });

  if (!course) return null;

  // Revenue aggregation (only PAID)
  const revenue = await prisma.payment.aggregate({
    where: {
      courseId,
      status: "PAID",
    },
    _sum: {
      amount: true,
    },
  });

  return {
    ...course,
    stats: {
      totalEnrollments: course._count.enrollments,
      totalPayments: course._count.payments,
      totalRevenue: revenue._sum.amount ?? 0,
    },
  };
};

// Public single course view
const findByIdPublic = async (courseId: string, studentId: string) => {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      isDeleted: false,
      isDisabled: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      startDate: true,
      isEnrollmentOpen: true,

      teacher: {
        select: {
          id: true,
          name: true,
        },
      },

      _count: {
        select: {
          lectures: {
            where: {
              status: "COMPLETED",
            },
          },
        },
      },

      enrollments: studentId
        ? {
            where: {
              studentId,
            },
            select: {
              id: true,
            },
          }
        : false,
    },
  });

  if (!course) return null;
  return {
    ...course,
    isEnrolled: !!studentId && (course.enrollments?.length ?? 0) > 0,
    enrollments: undefined,
  };
};

// Fetching teacher's courses
const findByIdInternalOwnerView = async (
  courseId: string,
  teacherId: string,
) => {
  const [course, revenueAgg, paymentStatusAgg] = await Promise.all([
    prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: teacherId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        price: true,
        startDate: true,
        isEnrollmentOpen: true,
        isDisabled: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,

        lectures: {
          where: { isDeleted: false },
          select: {
            id: true,
            title: true,
            startTime: true,
            status: true,
            _count: {
              select: {
                attendance: true,
                participants: true,
              },
            },
          },
        },

        enrollments: {
          take: 5, // preview only
          orderBy: { createdAt: "desc" },
          select: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },

        _count: {
          select: {
            lectures: true,
            enrollments: true,
            payments: true,
          },
        },
      },
    }),

    // Revenue aggregation
    prisma.payment.aggregate({
      where: {
        courseId,
        status: "PAID",
      },
      _sum: {
        amount: true,
      },
      _count: true,
    }),

    // Payment status breakdown
    prisma.payment.groupBy({
      by: ["status"],
      where: { courseId },
      _count: true,
    }),
  ]);

  if (!course) return null;

  return {
    course: {
      ...course,
      formattedPrice: `₹${(course.price / 100).toFixed(2)}`,
    },

    stats: {
      totalLectures: course._count.lectures,
      totalStudents: course._count.enrollments,
      totalPayments: course._count.payments,
      revenue: revenueAgg._sum.amount ?? 0,
      formattedRevenue: `₹${((revenueAgg._sum.amount ?? 0) / 100).toFixed(2)}`,
      paymentBreakdown: paymentStatusAgg,
    },

    lectureSummary: course.lectures.map((l) => ({
      id: l.id,
      title: l.title,
      startTime: l.startTime,
      status: l.status,
      attendanceCount: l._count.attendance,
      liveParticipantsCount: l._count.participants,
    })),

    enrollmentPreview: {
      totalStudents: course._count.enrollments,
      recentStudents: course.enrollments.map((e) => e.student),
    },
  };
};

// Fetching teacher's course with id
const findAllInternalOwnerView = async (teacherId: string) => {
  return prisma.course.findMany({
    where: {
      teacherId: teacherId,
    },
    include: {
      lectures: true,
      enrollments: {
        select: {
          id: true,
        },
      },
    },
  });
};

// disable course by admin
const toggleDisableCourseInternal = async (
  courseId: string,
  isDisabled: boolean,
) => {
  return prisma.course.update({
    where: { id: courseId },
    data: { isDisabled },
  });
};

const patchCourseByOwner = async (
  courseId: string,
  teacherId: string,
  safeUpdates: any,
) => {
  return prisma.course.update({
    where: { id: courseId, teacherId },
    data: safeUpdates,
  });
};

const editCourse = async (courseId: string, requestBody: any) => {
  const updateData: any = {};

  if (requestBody.title !== undefined) updateData.title = requestBody.title;

  if (requestBody.description !== undefined)
    updateData.description = requestBody.description;

  if (requestBody.price !== undefined) updateData.price = requestBody.price; // already number (paise)

  if (requestBody.imageUrl !== undefined)
    updateData.imageUrl = requestBody.imageUrl;

  if (requestBody.startDate !== undefined)
    updateData.startDate = new Date(requestBody.startDate);

  return prisma.course.update({
    where: { id: courseId },
    data: updateData,
  });
};

export default {
  CreateCourseOwnerInternal,
  findAllInternal,
  findAllInternalOwnerView,
  findAllPublic,
  isCourseOwnedByUser,
  findByIdInternal,
  findByIdPublic,
  findByIdInternalOwnerView,
  toggleDisableCourseInternal,
  patchCourseByOwner,
  editCourse,
};
