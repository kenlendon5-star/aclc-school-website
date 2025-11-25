import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the user's role from Clerk.
 * Uses currentUser() as primary source since it always includes publicMetadata.
 * sessionClaims.publicMetadata is not available by default in Clerk sessions.
 */
export async function getUserRole(): Promise<string | undefined> {
  try {
    // currentUser() always includes publicMetadata, so use it as primary source
    const user = await currentUser();
    const role = user?.publicMetadata?.role as string | undefined;
    
    // Debug logging
    if (!role) {
      console.log("⚠️ getUserRole: No role found in currentUser().publicMetadata");
      console.log("   User ID:", user?.id);
      console.log("   User publicMetadata:", user?.publicMetadata);
      
      // Fallback to sessionClaims (though it usually won't have publicMetadata)
      const { sessionClaims } = auth();
      const sessionRole = (sessionClaims?.publicMetadata as { role?: string })?.role;
      if (!sessionRole) {
        console.log("⚠️ getUserRole: No role in sessionClaims either");
      }
      return sessionRole;
    }
    
    console.log("✅ getUserRole: Found role:", role);
    return role;
  } catch (error) {
    console.error("❌ Error getting user role:", error);
    return undefined;
  }
}

