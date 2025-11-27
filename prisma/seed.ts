import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clean existing data to avoid unique constraint issues
  await prisma.$transaction([
    prisma.result.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.exam.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.student.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.event.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.class.deleteMany(),
    prisma.grade.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.admin.deleteMany(),
  ]);

  // // ADMIN
  // await prisma.admin.create({
  //   data: {
  //     id: "admin1",
  //     username: "admin1",
  //   },
  // });
  // await prisma.admin.create({
  //   data: {
  //     id: "admin2",
  //     username: "admin2",
  //   },
  // });

  // // GRADE
  // const gradeRecords = [];
  // for (let i = 1; i <= 4; i++) {
  //   const grade = await prisma.grade.create({
  //     data: {
  //       level: i,
  //     },
  //   });
  //   gradeRecords.push(grade);
  // }
  // const gradeIds = gradeRecords.map((grade) => grade.id);

  // // CLASS
  // const classRecords = [];
  // for (let i = 1; i <= 4; i++) {
  //   const classItem = await prisma.class.create({
  //     data: {
  //       name: `${i}A`,
  //       gradeId: gradeIds[(i - 1) % gradeIds.length],
  //       capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
  //     },
  //   });
  //   classRecords.push(classItem);
  // }
  // const classIds = classRecords.map((cls) => cls.id);

  // // SUBJECT
  // const subjectData = [
  //   { name: "OOP" },
  //   { name: "Filipino" },
  //   { name: "Math" },
  //   { name: "History" },
  //   { name: "Computer Science" },
  //   { name: "Art" },
  // ];

  // const subjectRecords = [];
  // for (const subject of subjectData) {
  //   const createdSubject = await prisma.subject.create({ data: subject });
  //   subjectRecords.push(createdSubject);
  // }
  // const subjectIds = subjectRecords.map((subject) => subject.id);

  // // TEACHER
  // const teacherRecords = [];
  // for (let i = 1; i <= 15; i++) {
  //   const teacher = await prisma.teacher.create({
  //     data: {
  //       id: `teacher${i}`, // Unique ID for the teacher
  //       username: `teacher${i}`,
  //       name: `TName${i}`,
  //       surname: `TSurname${i}`,
  //       email: `teacher${i}@example.com`,
  //       phone: `123-456-789${i}`,
  //       address: `Address${i}`,
  //       bloodType: "A+",
  //       sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
  //       subjects: {
  //         connect: [{ id: subjectIds[(i - 1) % subjectIds.length] }],
  //       },
  //       classes: { connect: [{ id: classIds[(i - 1) % classIds.length] }] },
  //       birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
  //     },
  //   });
  //   teacherRecords.push(teacher);
  // }
  // const teacherIds = teacherRecords.map((teacher) => teacher.id);

  // // LESSON
  // const lessonRecords = [];
  // for (let i = 1; i <= 30; i++) {
  //   const lesson = await prisma.lesson.create({
  //     data: {
  //       name: `Lesson${i}`,
  //       day: Day[
  //         Object.keys(Day)[
  //           Math.floor(Math.random() * Object.keys(Day).length)
  //         ] as keyof typeof Day
  //       ],
  //       startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  //       endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
  //       subjectId: subjectIds[(i - 1) % subjectIds.length],
  //       classId: classIds[(i - 1) % classIds.length],
  //       teacherId: teacherIds[(i - 1) % teacherIds.length],
  //     },
  //   });
  //   lessonRecords.push(lesson);
  // }
  // const lessonIds = lessonRecords.map((lesson) => lesson.id);

  // // PARENT
  // const parentRecords = [];
  // for (let i = 1; i <= 25; i++) {
  //   const parent = await prisma.parent.create({
  //     data: {
  //       id: `parentId${i}`,
  //       username: `parentId${i}`,
  //       name: `PName ${i}`,
  //       surname: `PSurname ${i}`,
  //       email: `parent${i}@example.com`,
  //       phone: `123-456-789${i}`,
  //       address: `Address${i}`,
  //     },
  //   });
  //   parentRecords.push(parent);
  // }
  // const parentIds = parentRecords.map((parent) => parent.id);

  // // STUDENT
  // const studentRecords = [];
  // for (let i = 1; i <= 50; i++) {
  //   const student = await prisma.student.create({
  //     data: {
  //       id: `student${i}`,
  //       username: `student${i}`,
  //       name: `SName${i}`,
  //       surname: `SSurname ${i}`,
  //       email: `student${i}@example.com`,
  //       phone: `987-654-321${i}`,
  //       address: `Address${i}`,
  //       bloodType: "O-",
  //       sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
  //       parentId: parentIds[(i - 1) % parentIds.length],
  //       gradeId: gradeIds[(i - 1) % gradeIds.length],
  //       classId: classIds[(i - 1) % classIds.length],
  //       birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
  //     },
  //   });
  //   studentRecords.push(student);
  // }
  // const studentIds = studentRecords.map((student) => student.id);

  // // EXAM
  // const examRecords = [];
  // for (let i = 1; i <= 10; i++) {
  //   const exam = await prisma.exam.create({
  //     data: {
  //       title: `Exam ${i}`,
  //       startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  //       endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
  //       lessonId: lessonIds[(i - 1) % lessonIds.length],
  //     },
  //   });
  //   examRecords.push(exam);
  // }
  // const examIds = examRecords.map((exam) => exam.id);

  // // ASSIGNMENT
  // const assignmentRecords = [];
  // for (let i = 1; i <= 10; i++) {
  //   const assignment = await prisma.assignment.create({
  //     data: {
  //       title: `Assignment ${i}`,
  //       startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
  //       dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  //       lessonId: lessonIds[(i - 1) % lessonIds.length],
  //     },
  //   });
  //   assignmentRecords.push(assignment);
  // }
  // const assignmentIds = assignmentRecords.map((assignment) => assignment.id);

  // // RESULT
  // for (let i = 1; i <= 10; i++) {
  //   await prisma.result.create({
  //     data: {
  //       score: 90,
  //       studentId: studentIds[(i - 1) % studentIds.length],
  //       ...(i <= 5
  //         ? { examId: examIds[(i - 1) % examIds.length] }
  //         : { assignmentId: assignmentIds[(i - 6) % assignmentIds.length] }),
  //     },
  //   });
  // }

  // // ATTENDANCE
  // for (let i = 1; i <= 10; i++) {
  //   await prisma.attendance.create({
  //     data: {
  //       date: new Date(),
  //       present: true,
  //       studentId: studentIds[(i - 1) % studentIds.length],
  //       lessonId: lessonIds[(i - 1) % lessonIds.length],
  //     },
  //   });
  // }

  // // EVENT
  // for (let i = 1; i <= 5; i++) {
  //   await prisma.event.create({
  //     data: {
  //       title: `Event ${i}`,
  //       description: `Description for Event ${i}`,
  //       startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  //       endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
  //       classId: classIds[(i - 1) % classIds.length],
  //     },
  //   });
  // }

  // // ANNOUNCEMENT
  // for (let i = 1; i <= 5; i++) {
  //   await prisma.announcement.create({
  //     data: {
  //       title: `Announcement ${i}`,
  //       description: `Description for Announcement ${i}`,
  //       date: new Date(),
  //       classId: classIds[(i - 1) % classIds.length],
  //     },
  //   });
  // }

  // console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
