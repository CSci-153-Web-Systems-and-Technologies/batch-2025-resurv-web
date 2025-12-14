'use server'

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function syncUserRole() { // OR syncUserRole
  const user = await currentUser();

  if (!user || user.publicMetadata?.role) {
    return { success: true }; 
  }

  try {
    // 1. Update Clerk Metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: "student" },
    });

    // 2. Update Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // FIX: Changed .from('users') to .from('profiles')
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, 
      email: user.emailAddresses[0]?.emailAddress,
      role: "student", 
      full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      // student_id: null, // Optional: Add this if your DB requires it
    });

    if (error) {
        console.error("Supabase sync failed:", error);
        return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Sync failed:", err);
    return { success: false };
  }
}