import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const UserProfilePage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  return redirect(`/list/students/${userId}`);
};

export default UserProfilePage;
