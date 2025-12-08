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
  if (!user) return redirect("/authentication/login");

  const { data: facility, error } = await supabase
    .from('facilities')
    .select('id, title')
    .eq('id', id)
    .single();

  if (error || !facility) {
    return <div>Error: Facility not found</div>;
  }

  // NOTE: We REMOVED the booking fetch here. The card handles it now.

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/authentication/dashboard" className="text-black">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <span className="text-black">{facility.title}</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            <ReservationCard 
                facility={facility} 
                userId={user.id} 
                // REMOVED: bookedDates prop
            />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}