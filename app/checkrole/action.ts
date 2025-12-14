"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function assignStudentRole(userId: string) {
  const client = await clerkClient();

  // 1. Update Clerk Metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "student",
    },
  });

  // 2. Sync to Supabase
  // We use the Service Role Key here to bypass RLS for profile creation
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // We need to fetch the email to sync it
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    email: email,
    full_name: fullName,
    role: "student",
  });

  if (error) {
    console.error("Supabase Sync Error:", error);
    throw new Error("Failed to sync profile");
  }

  return { success: true };
}