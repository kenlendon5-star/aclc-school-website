
"use server";

import { revalidatePath } from "next/cache";
import {
  AssignmentSchema,
  AttendanceSchema,
  ClassSchema,
  ExamSchema,
  LessonSchema,
  ParentSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
  EventSchema,
  AnnouncementSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

/* ----------------------------- SUBJECTS ----------------------------- */
export const createSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((id) => ({ id })), // teacher IDs are strings
        },
      },
    });
    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create subject error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.update({
      where: { id: Number(data.id) }, // convert to number
      data: {
        name: data.name,
        teachers: { set: data.teachers.map((id) => ({ id })) },
      },
    });
    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update subject error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    // Find all lessons tied to this subject
    const lessons = await prisma.lesson.findMany({
      where: { subjectId: id },
      select: { id: true },
    });
    const lessonIds = lessons.map((lesson) => lesson.id);

    if (lessonIds.length > 0) {
      // Gather related exams/assignments for cascading deletes
      const exams = await prisma.exam.findMany({
        where: { lessonId: { in: lessonIds } },
        select: { id: true },
      });
      const assignments = await prisma.assignment.findMany({
        where: { lessonId: { in: lessonIds } },
        select: { id: true },
      });

      const examIds = exams.map((exam) => exam.id);
      const assignmentIds = assignments.map((assignment) => assignment.id);

      if (examIds.length > 0 || assignmentIds.length > 0) {
        await prisma.result.deleteMany({
          where: {
            OR: [
              ...(examIds.length ? [{ examId: { in: examIds } }] : []),
              ...(assignmentIds.length ? [{ assignmentId: { in: assignmentIds } }] : []),
            ],
          },
        });
      }

      await prisma.assignment.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.exam.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.attendance.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
    }

    await prisma.subject.delete({ where: { id } });
    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete subject error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- CLASSES ----------------------------- */
export const createClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.create({ data });
    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create class error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.update({
      where: { id: Number(data.id) },
      data,
    });
    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update class error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    await prisma.class.delete({ where: { id } });
    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete class error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- TEACHERS ----------------------------- */
export const createTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  try {
    const user = await clerkClient().users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: { connect: data.subjects?.map((id) => ({ id: Number(id) })) || [] }, // subjects are numbers
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create teacher error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    await clerkClient().users.updateUser(data.id, {
      username: data.username,
      ...(data.password ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        username: data.username,
        ...(data.password ? { password: data.password } : {}),
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: { set: data.subjects?.map((id) => ({ id: Number(id) })) || [] },
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update teacher error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true };
  try {
    // Get all lessons taught by this teacher
    const lessons = await prisma.lesson.findMany({
      where: { teacherId: id },
      select: { id: true },
    });
    const lessonIds = lessons.map((lesson) => lesson.id);

    // Delete related records for all lessons taught by this teacher
    if (lessonIds.length > 0) {
      // First, delete all Results that reference Exams or Assignments for these lessons
      // Get exam and assignment IDs first
      const exams = await prisma.exam.findMany({
        where: { lessonId: { in: lessonIds } },
        select: { id: true },
      });
      const assignments = await prisma.assignment.findMany({
        where: { lessonId: { in: lessonIds } },
        select: { id: true },
      });
      
      const examIds = exams.map((e) => e.id);
      const assignmentIds = assignments.map((a) => a.id);

      // Delete Results that reference these exams or assignments
      if (examIds.length > 0 || assignmentIds.length > 0) {
        await prisma.result.deleteMany({
          where: {
            OR: [
              ...(examIds.length > 0 ? [{ examId: { in: examIds } }] : []),
              ...(assignmentIds.length > 0 ? [{ assignmentId: { in: assignmentIds } }] : []),
            ],
          },
        });
      }

      // Delete all Exams for these lessons
      await prisma.exam.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });

      // Delete all Assignments for these lessons
      await prisma.assignment.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });

      // Delete all Attendances for these lessons
      await prisma.attendance.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });

      // Delete all Lessons taught by this teacher
      await prisma.lesson.deleteMany({
        where: { teacherId: id },
      });
    }

    // Remove teacher as supervisor from all classes
    await prisma.class.updateMany({
      where: { supervisorId: id },
      data: { supervisorId: null },
    });

    // Disconnect teacher from all subjects (many-to-many relationship)
    // Only update if teacher exists and has subjects
    try {
      await prisma.teacher.update({
        where: { id },
        data: {
          subjects: {
            set: [], // Disconnect all subjects
          },
        },
      });
    } catch (updateError: any) {
      // If update fails (e.g., teacher doesn't exist), log but continue
      console.log("Teacher update error (non-fatal):", updateError?.message || updateError);
    }

    // Try to delete Clerk user, but don't fail if user doesn't exist
    try {
      await clerkClient().users.deleteUser(id);
    } catch (clerkError: any) {
      // If Clerk user doesn't exist (404/Not Found), that's okay - continue with DB deletion
      if (clerkError?.status === 404 || clerkError?.message?.includes("Not Found")) {
        console.log("Clerk user not found, continuing with database deletion");
      } else {
        // For other Clerk errors, log but continue
        console.log("Clerk deletion error (non-fatal):", clerkError?.message || clerkError);
      }
    }

    // Finally, delete the teacher record
    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete teacher error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- PARENTS ----------------------------- */
export const createParent = async (currentState: CurrentState, data: ParentSchema) => {
  let clerkUserId: string | null = null;
  try {
    if (!data.password || data.password.length < 8) {
      console.log("Create parent error: Password must be at least 8 characters long");
      return { success: false, error: true };
    }

    const user = await clerkClient().users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      ...(data.email ? { emailAddresses: [{ emailAddress: data.email, verified: true }] } : {}),
      publicMetadata: { role: "parent" },
    });
    clerkUserId = user.id;

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    });
    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err: any) {
    if (clerkUserId) {
      try {
        await clerkClient().users.deleteUser(clerkUserId);
      } catch (cleanupError) {
        console.log("Parent cleanup error:", cleanupError);
      }
    }
    console.log("Create parent error:", err?.errors || err.message || err);
    return { success: false, error: true };
  }
};

export const updateParent = async (currentState: CurrentState, data: ParentSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    if (data.password && data.password.length > 0 && data.password.length < 8) {
      console.log("Update parent error: Password must be at least 8 characters long");
      return { success: false, error: true };
    }

    try {
      await clerkClient().users.updateUser(data.id, {
        username: data.username,
        ...(data.password ? { password: data.password } : {}),
        firstName: data.name,
        lastName: data.surname,
        ...(data.email ? { emailAddress: data.email } : {}),
      });
    } catch (clerkError: any) {
      if (clerkError?.status === 404 || clerkError?.message?.includes("Not Found")) {
        console.log("Update parent warning: Clerk account not found, skipping user update");
      } else {
        throw clerkError;
      }
    }

    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    });
    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update parent error:", err?.errors || err.message || err);
    return { success: false, error: true };
  }
};

export const deleteParent = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true };
  try {
    const students = await prisma.student.findMany({
      where: { parentId: id },
      select: { id: true },
    });

    if (students.length > 0) {
      for (const student of students) {
        try {
          await deleteStudentCascade(student.id);
        } catch (cascadeError: any) {
          console.log(
            "Delete parent error while removing student:",
            cascadeError?.message || cascadeError
          );
          throw cascadeError;
        }
      }
      revalidatePath("/list/students");
    }

    try {
      await clerkClient().users.deleteUser(id);
    } catch (clerkError: any) {
      if (clerkError?.status === 404 || clerkError?.message?.includes("Not Found")) {
        console.log("Parent Clerk account not found, continuing with database deletion");
      } else {
        console.log("Parent clerk delete error:", clerkError.message || clerkError);
      }
    }

    await prisma.parent.delete({ where: { id } });
    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete parent error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- STUDENTS ----------------------------- */

const deleteStudentCascade = async (id: string) => {
  // Remove dependent records that reference the student
  await prisma.result.deleteMany({ where: { studentId: id } });
  await prisma.attendance.deleteMany({ where: { studentId: id } });

  // Remove the Clerk user if it exists
  try {
    await clerkClient().users.deleteUser(id);
  } catch (clerkError: any) {
    if (clerkError?.status === 404 || clerkError?.message?.includes("Not Found")) {
      console.log("Student cascade: Clerk user not found, continuing deletion");
    } else {
      console.log(
        "Student cascade: Clerk deletion error (non-fatal):",
        clerkError?.message || clerkError
      );
    }
  }

  // Finally delete the student record
  await prisma.student.delete({ where: { id } });
};
export const createStudent = async (currentState: CurrentState, data: StudentSchema) => {
  let clerkUserId: string | null = null;
  
  try {
    // Convert required IDs
    const classId = Number(data.classId);
    const gradeId = Number(data.gradeId);
    const parentId = String(data.parentId);

    // Validate required fields BEFORE creating user
    if (!classId || !gradeId || !parentId) {
      console.log("❌ Missing required foreign keys:", { classId, gradeId, parentId });
      return { success: false, error: true };
    }

    // Validate that parent exists
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      console.log("❌ Parent not found:", parentId);
      return { success: false, error: true };
    }

    // Validate that grade exists
    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
    });

    if (!grade) {
      console.log("❌ Grade not found:", gradeId);
      return { success: false, error: true };
    }

    // Check class capacity
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      include: { _count: { select: { students: true } } },
    });

    if (!classItem) {
      console.log("❌ Class not found:", classId);
      return { success: false, error: true };
    }

    if (classItem.capacity <= classItem._count.students) {
      console.log("❌ Class is at capacity");
      return { success: false, error: true };
    }

    // Create user in Clerk first
    const user = await clerkClient().users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });
    
    clerkUserId = user.id;
    console.log("✅ Clerk user created:", clerkUserId);

    // Insert into Prisma
    try {
      await prisma.student.create({
        data: {
          id: user.id,
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email || undefined,
          phone: data.phone || undefined,
          address: data.address,
          img: data.img || undefined,
          bloodType: data.bloodType,
          sex: data.sex,
          birthday: new Date(data.birthday),
          // Required relations
          gradeId: gradeId,
          classId: classId,
          parentId: parentId,
        },
      });
      console.log("✅ Student created in database");
    } catch (prismaError: any) {
      console.error("❌ Prisma create error:", prismaError.message || prismaError);
      console.error("❌ Prisma error details:", JSON.stringify(prismaError, null, 2));
      
      // If Prisma creation fails, clean up the Clerk user
      if (clerkUserId) {
        try {
          await clerkClient().users.deleteUser(clerkUserId);
          console.log("🧹 Cleaned up Clerk user after Prisma failure");
        } catch (cleanupError: any) {
          console.error("⚠️ Failed to cleanup Clerk user:", cleanupError.message || cleanupError);
        }
      }
      
      throw prismaError; // Re-throw to be caught by outer catch
    }

    revalidatePath("/list/students");
    return { success: true, error: false };

  } catch (err: any) {
    console.error("🔥 Create student error:", err.message || err);
    console.error("🔥 Error stack:", err.stack);
    
    // Final cleanup attempt if Clerk user was created but Prisma failed
    if (clerkUserId) {
      try {
        await clerkClient().users.deleteUser(clerkUserId);
        console.log("🧹 Final cleanup: Deleted orphaned Clerk user");
      } catch (cleanupError: any) {
        console.error("⚠️ Final cleanup failed:", cleanupError.message || cleanupError);
      }
    }
    
    return { success: false, error: true };
  }
};


export const updateStudent = async (currentState: CurrentState, data: StudentSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    await clerkClient().users.updateUser(data.id, {
      username: data.username,
      ...(data.password ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        ...(data.password ? { password: data.password } : {}),
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: Number(data.classId),
        parentId: data.parentId,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update student error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true };
  try {
    await deleteStudentCascade(id);
    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete student error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- LESSONS ----------------------------- */
export const createLesson = async (currentState: CurrentState, data: LessonSchema) => {
  try {
    if (data.startTime >= data.endTime) {
      console.log("Lesson end time must be after start time");
      return { success: false, error: true };
    }

    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: Number(data.subjectId),
        classId: Number(data.classId),
        teacherId: data.teacherId,
      },
    });
    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create lesson error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (currentState: CurrentState, data: LessonSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    if (data.startTime >= data.endTime) {
      console.log("Lesson end time must be after start time");
      return { success: false, error: true };
    }

    await prisma.lesson.update({
      where: { id: Number(data.id) },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: Number(data.subjectId),
        classId: Number(data.classId),
        teacherId: data.teacherId,
      },
    });
    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update lesson error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    const exams = await prisma.exam.findMany({
      where: { lessonId: id },
      select: { id: true },
    });
    const assignments = await prisma.assignment.findMany({
      where: { lessonId: id },
      select: { id: true },
    });

    const examIds = exams.map((exam) => exam.id);
    const assignmentIds = assignments.map((assignment) => assignment.id);

    if (examIds.length > 0 || assignmentIds.length > 0) {
      await prisma.result.deleteMany({
        where: {
          OR: [
            ...(examIds.length ? [{ examId: { in: examIds } }] : []),
            ...(assignmentIds.length ? [{ assignmentId: { in: assignmentIds } }] : []),
          ],
        },
      });
    }

    await prisma.exam.deleteMany({ where: { lessonId: id } });
    await prisma.assignment.deleteMany({ where: { lessonId: id } });
    await prisma.attendance.deleteMany({ where: { lessonId: id } });
    await prisma.lesson.delete({ where: { id } });

    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete lesson error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- EXAMS ----------------------------- */
export const createExam = async (currentState: CurrentState, data: ExamSchema) => {
  try {
    // defensively strip any unexpected keys that a client might send
    const anyData = data as any;
    if (anyData && typeof anyData === "object") {
      delete anyData.subject;
      delete anyData.lesson; // ensure no nested lesson object sneaks in
    }

    const title = data.title;
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const lessonId = Number(data.lessonId);

    // Fetch the lesson to get subjectId and classId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { subjectId: true, classId: true },
    });

    if (!lesson) {
      console.log("Create exam error: Lesson not found");
      return { success: false, error: true };
    }

    await prisma.exam.create({
      data: {
        title,
        startTime,
        endTime,
        lesson: { connect: { id: lessonId } },
        subject: { connect: { id: lesson.subjectId } },
        class: { connect: { id: lesson.classId } },
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create exam error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateExam = async (currentState: CurrentState, data: ExamSchema) => {
  try {
    const anyData = data as any;
    if (anyData && typeof anyData === "object") {
      delete anyData.subject;
      delete anyData.lesson;
    }
    const id = Number((data as any).id);
    const title = data.title;
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const lessonId = Number(data.lessonId);

    // Fetch the lesson to get subjectId and classId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { subjectId: true, classId: true },
    });

    if (!lesson) {
      console.log("Update exam error: Lesson not found");
      return { success: false, error: true };
    }

    await prisma.exam.update({
      where: { id },
      data: {
        title,
        startTime,
        endTime,
        lesson: { connect: { id: lessonId } },
        subject: { connect: { id: lesson.subjectId } },
        class: { connect: { id: lesson.classId } },
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update exam error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    await prisma.exam.delete({ where: { id } });
    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete exam error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- ASSIGNMENTS ----------------------------- */
export const createAssignment = async (currentState: CurrentState, data: AssignmentSchema) => {
  try {
    if (data.startDate >= data.dueDate) {
      console.log("Assignment due date must be after start date");
      return { success: false, error: true };
    }

    const lessonId = Number(data.lessonId);

    // Fetch the lesson to get subjectId and classId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { subjectId: true, classId: true },
    });

    if (!lesson) {
      console.log("Create assignment error: Lesson not found");
      return { success: false, error: true };
    }

    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lesson: { connect: { id: lessonId } },
        subject: { connect: { id: lesson.subjectId } },
        class: { connect: { id: lesson.classId } },
      },
    });
    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create assignment error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (currentState: CurrentState, data: AssignmentSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    if (data.startDate >= data.dueDate) {
      console.log("Assignment due date must be after start date");
      return { success: false, error: true };
    }

    const lessonId = Number(data.lessonId);

    // Fetch the lesson to get subjectId and classId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { subjectId: true, classId: true },
    });

    if (!lesson) {
      console.log("Update assignment error: Lesson not found");
      return { success: false, error: true };
    }

    await prisma.assignment.update({
      where: { id: Number(data.id) },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lesson: { connect: { id: lessonId } },
        subject: { connect: { id: lesson.subjectId } },
        class: { connect: { id: lesson.classId } },
      },
    });
    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update assignment error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    await prisma.result.deleteMany({ where: { assignmentId: id } });
    await prisma.assignment.delete({ where: { id } });
    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete assignment error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- RESULTS ----------------------------- */
export const createResult = async (currentState: CurrentState, data: ResultSchema) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId ? Number(data.examId) : undefined,
        assignmentId: data.assignmentId ? Number(data.assignmentId) : undefined,
      },
    });
    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create result error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateResult = async (currentState: CurrentState, data: ResultSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    await prisma.result.update({
      where: { id: Number(data.id) },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId ? Number(data.examId) : null,
        assignmentId: data.assignmentId ? Number(data.assignmentId) : null,
      },
    });
    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update result error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    await prisma.result.delete({ where: { id } });
    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete result error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- ATTENDANCE ----------------------------- */
export const createAttendance = async (currentState: CurrentState, data: AttendanceSchema) => {
  try {
    await prisma.attendance.create({
      data: {
        date: data.date,
        present: data.present,
        studentId: data.studentId,
        lessonId: Number(data.lessonId),
      },
    });
    revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create attendance error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateAttendance = async (currentState: CurrentState, data: AttendanceSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    await prisma.attendance.update({
      where: { id: Number(data.id) },
      data: {
        date: data.date,
        present: data.present,
        studentId: data.studentId,
        lessonId: Number(data.lessonId),
      },
    });
    revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update attendance error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteAttendance = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    await prisma.attendance.delete({ where: { id } });
    revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete attendance error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- EVENTS ----------------------------- */
export const createEvent = async (currentState: CurrentState, data: EventSchema) => {
  try {
    if (data.endTime <= data.startTime) {
      console.log("Create event error: End time must be after start time");
      return { success: false, error: true };
    }

    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId ?? null,
      },
    });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create event error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (currentState: CurrentState, data: EventSchema) => {
  if (!data.id) return { success: false, error: true };
  try {
    if (data.endTime <= data.startTime) {
      console.log("Update event error: End time must be after start time");
      return { success: false, error: true };
    }

    await prisma.event.update({
      where: { id: Number(data.id) },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId ?? null,
      },
    });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update event error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    await prisma.event.delete({ where: { id } });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete event error:", err.message || err);
    return { success: false, error: true };
  }
};

/* ----------------------------- ANNOUNCEMENTS ----------------------------- */
export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId ?? null,
      },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Create announcement error:", err.message || err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  if (!data.id) return { success: false, error: true };
  try {
    await prisma.announcement.update({
      where: { id: Number(data.id) },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId ?? null,
      },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Update announcement error:", err.message || err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (currentState: CurrentState, data: FormData) => {
  const id = Number(data.get("id"));
  if (!id) return { success: false, error: true };
  try {
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("Delete announcement error:", err.message || err);
    return { success: false, error: true };
  }
};




