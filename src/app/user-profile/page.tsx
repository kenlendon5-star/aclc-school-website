import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const UserProfilePage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user data
  const user = await clerkClient.users.getUser(userId!);
  const role = (user.publicMetadata?.role as string) || ""; // expected: "teacher" | "student"

  if (role === "teacher") {
    redirect(`/list/teachers/${userId}`);
  }

  if (role === "student") {
    redirect(`/list/students/${userId}`);
  }

  // Fallback: go to dashboard/home if role is missing or unknown
  redirect("/");
};

export default UserProfilePage;
