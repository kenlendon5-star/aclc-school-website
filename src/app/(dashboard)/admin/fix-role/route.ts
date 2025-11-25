import { clerkClient, auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // Get userId from auth
    const { userId } = auth();
    
    // Also try to get from request body if provided
    let bodyUserId: string | undefined;
    try {
      const body = await req.json();
      bodyUserId = body.userId;
    } catch {
      // Request body might be empty, that's okay
    }
    
    const targetUserId = bodyUserId || userId;

    if (!targetUserId) {
      return new Response(JSON.stringify({ error: "Missing userId. Please ensure you're authenticated." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Force role to admin
    await clerkClient().users.updateUser(targetUserId, {
      publicMetadata: { role: "admin" },
    });

    return new Response(JSON.stringify({ 
      ok: true, 
      message: "Role updated to admin. Please sign out and sign back in for changes to take effect.",
      userId: targetUserId 
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Fix role error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to update role", 
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
