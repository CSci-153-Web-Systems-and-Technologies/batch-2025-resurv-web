'use client'

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { syncUserRole } from "@/lib/syncUser"; // Make sure this path matches where you put the sync script
import { useRouter } from "next/navigation"; 

// FIX: Added 'default' keyword below
export default function RoleSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && !user.publicMetadata.role) {
      
      const sync = async () => {
        console.log("Role missing. Starting sync...");
        const result = await syncUserRole();
        
        if (result.success) {
          console.log("Sync success. Please Proceed to Signing-in");
          await signOut(() => router.push('/sign-in'));
        }
      };

      sync();
    }
  }, [isLoaded, isSignedIn, user, router, signOut]);

  return null;
}