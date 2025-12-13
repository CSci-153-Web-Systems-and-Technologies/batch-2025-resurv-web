import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { supabase } from "@/lib/supabase"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { EventCalendarCard } from "./calendarcard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"



export default async function CalendarPage() {

  const { data: facilities } = await supabase
    .from('facilities')
    .select('id, title')
    .order('title');
  
  const { data: reservations } = await supabase
    .from('reservations')
    .select(`
      id,
      purpose,
      start_time,
      end_time,
      facility_id,
      facilities (title)
    `)
    .in('status', ['approved', 'pending']);
  const cleanFacilities = facilities?.map((f) => ({
    id: f.id,
    title: f.title || "Untitled Space" 
  })) || [];

  const events = reservations?.map((res: any) => ({
    id: res.id,
    title: res.purpose || "Reserved", // Use purpose as the event title
    from: new Date(res.start_time),
    to: new Date(res.end_time),
    facilityId: res.facility_id,
    facilityName: res.facilities?.title || "Unknown Space"
  })) || [];

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
                  <BreadcrumbLink href="" className="font-bold text-[#556378] text-lg">
                    Calendar
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            <EventCalendarCard 
                events={events} 
                facilities={cleanFacilities || []} 
            />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}