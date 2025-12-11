import { AppSidebar } from "@/components/app-sidebar"
import { supabase } from "@/lib/supabase" // Import real supabase client
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
  
  // 1. FETCH ALL FACILITIES (id, title)
  const { data: facilities, error } = await supabase
    .from('facilities')
    .select('id, title')
    .order('title');
  const { data: pendingReservations } = await supabase
    .from('reservations')
    .select(`
        id, 
        start_time, 
        end_time, 
        facility_id, 
        purpose,
        profiles (full_name, email)
    `)
    .eq('status', 'pending')
    .order('start_time', { ascending: true });

  // Handle empty or error case
  const safeFacilities = facilities || [];
  const safePending = pendingReservations || [];

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
                  <BreadcrumbLink href="/student/dashboard" className="text-black">Reservations</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            {/* 2. PASS THE LIST TO THE CARD */}
            <ReservationCard 
                facilities={safeFacilities} 
                userId={user.id}
                pendingReservations={safePending} 
            />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}