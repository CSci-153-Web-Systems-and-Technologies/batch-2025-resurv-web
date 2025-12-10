import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-app-sidebar" // We will create this
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
    
  // 1. SECURITY CHECK: Check the Metadata we set earlier
  if (user?.publicMetadata?.role !== 'admin') {
    return redirect("/authentication/dashboard"); // Kick them back to student dashboard
  }

  return (
    <SidebarProvider>
      {/* 2. RENDER ADMIN SIDEBAR */}
      <AdminSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}