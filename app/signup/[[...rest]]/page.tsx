"use client"
import { CalendarFold } from 'lucide-react';
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-svh lg:grid lg:grid-cols-2 bg-[#CEDBEE]">
      
      {/* 1. FORM SECTION */}
      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center flex-1">
        
        {/* Logo Header */}
        <div className="flex justify-center gap-2 md:justify-start text-[#556378] mb-4">
          <a href="/student/login" className="font-extrabold tracking-tight flex items-center gap-2">
            <div className="text-[#CEDBEE] flex size-6 items-center justify-center rounded-md bg-[#556378]">
              <CalendarFold className="size-4" />
            </div>
            Resurv
          </a>
        </div>

        {/* Clerk Sign Up Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs text-[#556378]">
            <SignUp routing="path" path="/signup" />
          </div>
        </div>
        
      </div>

      {/* 2. IMAGE SECTION */}
      {/* 'hidden' hides it on mobile. 'lg:block' shows it on large screens. */}
      <div className="hidden lg:block relative h-full w-full bg-muted">
        <img
          src="/MNM.jpg"
          alt="Campus Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

    </div>
  )
}