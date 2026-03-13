import { prisma } from "../lib/prisma.js";

const getUserProfile = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

const putUserProfile = async (userId: string, data: any) => {
  return await prisma.profile.upsert({
    where: {
      userId: userId,
    },
    update: {
      bio: data.bio,
      avatarUrl: data.imageUrl,
      headline: data.headline,
      website: data.website,
      github: data.github,
      linkedin: data.linkedin,
      twitter: data.twitter,
      location: data.location,
    },
    create: {
      userId: userId,
      bio: data.bio,
      avatarUrl: data.imageUrl,
      headline: data.headline,
      website: data.website,
      github: data.github,
      linkedin: data.linkedin,
      twitter: data.twitter,
      location: data.location,
    },
  });
};

export default { getUserProfile, putUserProfile };
