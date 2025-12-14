"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { assignStudentRole } from "./action"; // We will create this next
import { School } from "lucide-react";

export default function CheckRole() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState("Checking access...");

  useEffect(() => {
    // 1. Wait for Clerk to load
    if (!isLoaded) return;

    // 2. Not signed in? Go to login
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    const checkAndRedirect = async () => {
      // 3. Check if we already have the role in the BROWSER cookie
      const role = user.publicMetadata?.role;

      if (role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      if (role === "student") {
        router.push("/student/dashboard");
        return;
      }

      // 4. NO ROLE? We need to fix it.
      setStatus("Setting up your student profile...");
      
      try {
        // Call the Server Action to update the database
        await assignStudentRole(user.id);
        
        // CRITICAL STEP: Force the browser to refresh the token
        // This makes the Middleware see the new "student" role
        await user.reload(); 
        
        // Now we can go!
        router.push("/student/dashboard");
      } catch (err) {
        console.error("Failed to assign role", err);
        setStatus("Error setting up profile. Please contact support.");
      }
    };

    checkAndRedirect();
  }, [isLoaded, isSignedIn, user, router]);

  // Loading UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EEF4ED] text-[#556378] gap-4">
      <div className="animate-spin bg-[#556378] p-2 rounded-lg">
        <School className="text-white h-8 w-8" />
      </div>
      <p className="font-semibold animate-pulse">{status}</p>
    </div>
  );
}