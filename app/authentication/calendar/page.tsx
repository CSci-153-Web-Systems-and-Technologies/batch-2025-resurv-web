"use client"
import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { EventspaceCard } from "../eventspaces/eventspacecard";
import { EventSpaces } from "@/app/authentication/eventspaces/eventspace";
import { Button } from "@/components/ui/button";
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar" 
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


export default function Page() {
    const [date, setDate] = React.useState <Date | undefined>(
    new Date()
    )
    const bookedDates = Array.from(
    { length: 5 },
    (_, i) => new Date(2025, 11, 1 + i)//sample data
  )
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
          <div className="flex flex-col w-full max-w-5xl mx-auto mt-2 p-4 gap-6 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-stretch justify-center ">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={{
                booked: bookedDates, 
                }}
                modifiersClassNames={{
                booked: 
                "bg-red-100 text-red-400 " + 
                "line-through decoration-red-400 " +
                "cursor-not-allowed " +
                "opacity-100 " +
                "[&>button]:hover:bg-red-100 [&>button]:hover:text-red-400 [&>button]:cursor-not-allowed",
                }}
                className="rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-full h-full "
            />
            </div>
          </div>
      </SidebarInset>
    </SidebarProvider>
  )
}