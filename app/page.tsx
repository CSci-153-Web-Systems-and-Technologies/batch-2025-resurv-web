'use client'; // This makes the page reactive

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { syncUserRole } from "@/lib/syncUser"; 

export default function CheckRole() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState("Checking access...");

  useEffect(() => {
    // 1. Wait for Clerk to load completely
    if (!isLoaded) return;
    
    // 2. Not logged in? Go to login.
    if (!isSignedIn) {
      router.push('/login'); // Check if your route is /login or /sign-in
      return;
    }

    // 3. Check the Role
    const role = user.publicMetadata?.role;

    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'student') {
      router.push('/student/dashboard');
    } else {
      // 4. No Role? Run the Sync!
      handleSync();
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleSync = async () => {
    // FIX: TypeScript needs to know 'user' exists before we use it
    if (!user) return;

    setStatus("Setting up your account...");
    try {
      const result = await syncUserRole();
      if (result.success) {
        setStatus("Success! Redirecting...");
        
        // Vital: Refresh the browser's token
        await user.reload(); 
        
        // Force the redirect
        window.location.href = '/student/dashboard';
      }
    } catch (err) {
      console.error(err);
      setStatus("Error setting up account.");
    }
  };

  // 5. The "Loading" Screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p className="text-lg font-medium animate-pulse">{status}</p>
    </div>
  );
}