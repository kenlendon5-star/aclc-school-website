import Announcements from "@/components/AnnouncementsClient";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/getUserRole";

const AnnouncementsWrapper = async () => {
  const { userId } = auth();
  const role = await getUserRole();

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  const announcements = await prisma.announcement.findMany({
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  // Convert date to ISO string for client serialization
  const announcementsWithSerializedDate = announcements.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date.toISOString(),
  }));

  return <Announcements announcements={announcementsWithSerializedDate} />;
};

export default AnnouncementsWrapper;
