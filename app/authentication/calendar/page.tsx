import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { EventspaceCard } from "../eventspaces/eventspacecard";
import { EventSpaces } from "@/app/authentication/eventspaces/eventspace";
import { Button } from "@/components/ui/button";
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar" 
import { getEvents } from "./eventsdata"

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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CalendarPage({ params }: PageProps) {
    const events = await getEvents();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="" className="text-black">
                    Calendar
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            <EventCalendarCard events={events} />
            
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}