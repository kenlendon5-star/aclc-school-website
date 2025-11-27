import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/getUserRole";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId } = auth();
  const role = await getUserRole();
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        const studentParents = await prisma.parent.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { classes: studentClasses, grades: studentGrades, parents: studentParents };
        break;
      case "lesson":
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          subjects: lessonSubjects,
          classes: lessonClasses,
          teachers: lessonTeachers,
        };
        break;
      case "exam":
        // Provide lessons plus subject and class lists for filtering; restrict by access
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true, subjectId: true, classId: true },
        });
        // Unique subject and class options based on accessible lessons
        const examSubjectIds = Array.from(new Set(examLessons.map(l => l.subjectId)));
        const examClassIds = Array.from(new Set(examLessons.map(l => l.classId)));
        const examSubjects = await prisma.subject.findMany({
          where: { id: { in: examSubjectIds.length ? examSubjectIds : [0] } },
          select: { id: true, name: true },
        });
        const examClasses = await prisma.class.findMany({
          where: { id: { in: examClassIds.length ? examClassIds : [0] } },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons, subjects: examSubjects, classes: examClasses };
        break;
      case "assignment":
        // Provide lessons plus subject and class lists for filtering; restrict by access
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true, subjectId: true, classId: true },
        });
        const assignmentSubjectIds = Array.from(new Set(assignmentLessons.map(l => l.subjectId)));
        const assignmentClassIds = Array.from(new Set(assignmentLessons.map(l => l.classId)));
        const assignmentSubjects = await prisma.subject.findMany({
          where: { id: { in: assignmentSubjectIds.length ? assignmentSubjectIds : [0] } },
          select: { id: true, name: true },
        });
        const assignmentClasses = await prisma.class.findMany({
          where: { id: { in: assignmentClassIds.length ? assignmentClassIds : [0] } },
          select: { id: true, name: true },
        });
        relatedData = { lessons: assignmentLessons, subjects: assignmentSubjects, classes: assignmentClasses };
        break;
      case "result":
        const resultStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        const examFilter =
          role === "teacher" ? { lesson: { teacherId: currentUserId! } } : undefined;
        const resultExams = await prisma.exam.findMany({
          where: examFilter,
          select: { id: true, title: true },
        });
        const assignmentFilter =
          role === "teacher" ? { lesson: { teacherId: currentUserId! } } : undefined;
        const resultAssignments = await prisma.assignment.findMany({
          where: assignmentFilter,
          select: { id: true, title: true },
        });
        relatedData = {
          students: resultStudents,
          exams: resultExams,
          assignments: resultAssignments,
        };
        break;
      case "attendance":
        const attendanceStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        const attendanceLessons = await prisma.lesson.findMany({
          where: role === "teacher" ? { teacherId: currentUserId! } : undefined,
          select: { id: true, name: true },
        });
        relatedData = { students: attendanceStudents, lessons: attendanceLessons };
        break;
      case "event":
      case "announcement":
        const modalClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: modalClasses };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
