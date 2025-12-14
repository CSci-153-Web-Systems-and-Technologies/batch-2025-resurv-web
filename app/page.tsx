
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  CalendarCheck, 
  ShieldCheck, 
  Users, 
  LayoutDashboard, 
  School,
  ArrowRight,
  CalendarFold
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#EEF4ED] text-[#556378] flex flex-col font-sans selection:bg-[#C1E1C1] selection:text-[#556378]">
      
      {/* --- NAVBAR --- */}
      <header className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-[#556378] text-white p-1.5 rounded-lg">
            <CalendarFold className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Resurv</span>
        </div>
        <nav className="hidden md:flex gap-6 font-medium text-sm">
          <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="#roles" className="hover:text-black transition-colors">For Students</Link>
          <Link href="#roles" className="hover:text-black transition-colors">For Admins</Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/checkrole">
            <Button className="bg-[#556378] hover:bg-[#445166] text-white font-semibold shadow-lg shadow-[#556378]/20 cursor-pointer">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32 text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C1E1C1]/30 border border-[#556378]/10 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Batch 2025 Exclusive
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Campus Events, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#556378] to-[#7a8ba3] bg-clip-text text-transparent">
              Simply Scheduled.
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed">
            Book facilities, track approvals, and manage campus spaces effortlessly—all in one secure platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-[#556378] hover:bg-[#445166] shadow-xl shadow-[#556378]/20 transition-all hover:-translate-y-1 cursor-pointer">
                Book a Space
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 border-[#556378] text-[#556378] hover:bg-[#C1E1C1] hover:border-[#556378] cursor-pointer">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="w-full bg-white/50 border-y border-[#556378]/10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#EEF4ED] border border-[#556378]/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#556378] shadow-sm">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Instant Booking</h3>
                <p className="text-gray-600">Check real-time availability and request a reservation in seconds. No more paper forms.</p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#EEF4ED] border border-[#556378]/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#556378] shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-gray-600">Secure portals for Students and Admins. Your data is protected by industry-standard auth.</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#EEF4ED] border border-[#556378]/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#556378] shadow-sm">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Admin Controls</h3>
                <p className="text-gray-600">Powerful dashboard to review, approve, or reject requests with full transparency.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- DUAL PORTAL PREVIEW --- */}
        <section id="roles" className="w-full max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Whether you are organizing a student event or managing campus facilities, Resurv has a dedicated view for you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
            {/* Student Card */}
            <div className="relative group overflow-hidden rounded-2xl border-2 border-[#556378]/10 bg-white p-8 hover:border-[#556378] transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="h-32 w-32" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#556378]">Student Portal</h3>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2"><CheckIcon /> Browse available venues</li>
                <li className="flex items-center gap-2"><CheckIcon /> Submit detailed requests</li>
                <li className="flex items-center gap-2"><CheckIcon /> Track approval status</li>
              </ul>
              <Link href="/login">
                <Button variant="link" className="px-0 text-[#556378] font-bold decoration-2 cursor-pointer">Login as Student &rarr;</Button>
              </Link>
            </div>

            {/* Admin Card */}
            <div className="relative group overflow-hidden rounded-2xl border-2 border-[#556378]/10 bg-[#556378] text-white p-8 hover:shadow-2xl hover:shadow-[#556378]/30 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="h-32 w-32 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Admin Portal</h3>
              <ul className="space-y-3 mb-8 text-gray-200">
                <li className="flex items-center gap-2"><CheckIcon color="text-[#C1E1C1]" /> View pending requests</li>
                <li className="flex items-center gap-2"><CheckIcon color="text-[#C1E1C1]" /> Approve/Reject with 1 click</li>
                <li className="flex items-center gap-2"><CheckIcon color="text-[#C1E1C1]" /> Manage cancellations</li>
              </ul>
              <Link href="/login">
                <Button className="bg-[#C1E1C1] text-[#556378] hover:bg-white border-none font-bold cursor-pointer">Login as Admin</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#556378] text-[#EEF4ED] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarFold className="h-5 w-5 opacity-75" />
            <span className="font-semibold tracking-wide">Resurv <span className="opacity-50 font-normal">| Batch 2025</span></span>
          </div>
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} CSci 153 Project. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function CheckIcon({ color = "text-[#556378]" }: { color?: string }) {
  return (
    <svg
      className={`h-5 w-5 ${color} flex-shrink-0`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  )
}
