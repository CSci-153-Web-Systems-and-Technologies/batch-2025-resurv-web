import { AppSidebar } from "@/components/app-sidebar"
import { supabase } from "@/lib/supabase";
import { ReservationCard } from "./reservationcard"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  
  const user = await currentUser();
  if (!user) return redirect("/login");
  
  const { data: facility, error } = await supabase
    .from('facilities')
    .select('id, title')
    .eq('id', id)
    .single();

  if (error || !facility) {
    return <div>Error: Facility not found</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">  
            <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4 px-0.5 rounded bg-white" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/student/dashboard" className="font-bold text-[#556378] text-lg">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink  href={`/student/eventspaces/${id}`} className="font-bold text-[#556378] text-lg">{facility.title}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/student/reservation/${facility.id}`} className="font-bold text-[#556378] text-lg">Reservation</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            <ReservationCard 
                facility={facility} 
                userId={user.id} 
            />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}