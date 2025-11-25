import prisma from "@/lib/prisma";
import { Student, Attendance } from "@prisma/client";
import Link from "next/link";

const ITEMS_PER_PAGE = 20;

const AttendancePage = async ({ searchParams }: { searchParams?: { page?: string } }) => {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  // Fetch students with attendance this year
  const studentsWithAttendance = await prisma.student.findMany({
    include: {
      attendances: {
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
      },
    },
    skip: ITEMS_PER_PAGE * (page - 1),
    take: ITEMS_PER_PAGE,
  });

  const totalStudents = await prisma.student.count();

  // Map student attendance summary
  const attendanceSummary = studentsWithAttendance.map((student) => {
    const totalDays = student.attendances.length;
    const presentDays = student.attendances.filter((a) => a.present).length;
    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    return {
      id: student.id,
      name: student.name + " " + student.surname,
      attendancePercentage: totalDays > 0 ? percentage.toFixed(2) + "%" : "-",
    };
  });

  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

  return (
    <div className="p-4 bg-white rounded-md">
      <h1 className="text-xl font-semibold mb-4">Attendance Summary</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Attendance Percentage</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {attendanceSummary.map((student) => (
            <tr key={student.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{student.name}</td>
              <td className="border border-gray-300 px-4 py-2">{student.attendancePercentage}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Link href={`/list/students/${student.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
          {attendanceSummary.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4">No attendance records found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`/list/attendance?page=${pageNumber}`}
            className={`px-3 py-1 border rounded ${pageNumber === page ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
          >
            {pageNumber}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AttendancePage;
