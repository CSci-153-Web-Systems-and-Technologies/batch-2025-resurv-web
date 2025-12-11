import { AppSidebar } from "@/components/app-sidebar"
import { supabase } from "@/lib/supabase" 
import { ReservationCard } from "./admin-reservationcard"
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

export default async function ReservationPage() {
  const user = await currentUser();
  if (!user) return redirect("/login");
  
  // 1. Fetch Facilities (Public data is usually fine, or you can use server client)
  const { data: facilities } = await supabase
    .from('facilities')
    .select('id, title')
    .order('title');

  const safeFacilities = facilities || [];

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="" className="text-black">Reservations</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            {/* 2. REMOVED pendingReservations PROP */}
            <ReservationCard 
                facilities={safeFacilities} 
                userId={user.id} 
            />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}