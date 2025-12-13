"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export function AuthAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check if the URL has ?unauthorized=true
    if (searchParams.get("unauthorized")) {
      
      // 2. Show the popup (You can replace 'alert' with a toast or custom modal)
      alert("⚠️ Access Denied: You do not have permission to view that page.");

      // 3. Clean up the URL (Remove the ?unauthorized=true so the popup doesn't show again on refresh)
      const params = new URLSearchParams(searchParams.toString());
      params.delete("unauthorized");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  return null; // This component renders nothing visually
}