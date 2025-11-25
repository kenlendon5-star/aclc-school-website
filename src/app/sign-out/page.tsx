"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const SignOutPage = () => {
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    const doSignOut = async () => {
      await signOut();
      router.replace("/");
      router.refresh();
    };
    doSignOut();
  }, [router, signOut]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Signing out...</p>
    </div>
  );
};

export default SignOutPage;
