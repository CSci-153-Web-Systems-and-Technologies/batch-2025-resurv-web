"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Button } from "./ui/button"
import {
  AudioWaveform,
  Calendar,
  BookOpen,
  CalendarFold,
  LayoutDashboard,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/authentication/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Calendar",
      url: "/authentication/calendar",
      icon: CalendarFold,
    },
    {
      title: "Contacts",
      url: "/authentication/contacts",
      icon: BookOpen,

    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" className="flex flex-col min-h-screen items-center justify-center bg-[#556378] "{...props}>
      <SidebarHeader className="w-full px-2 py-4 h-32 flex items-center justify-center bg-[#556378] ">
        <Button className="w-full justify-center py-2 gap-1 bg-transparent hover:bg-transparent">
          <a
            href="/authentication/dashboard"
            className="flex items-center gap-2 justify-center w-full" 
          >
            <span
              className={
                "ml-2 text-4xl font-bold text-black transition-all duration-200 ease-in-out justify-center "
                
              }
            >
              <div className="w-6 h-6 flex items-center justify-center gap-1 text-[#C1E1C1]">
                <CalendarFold size={500} className="text-[#C1E1C1] w-8! h-8!" />
                 Resurv
              </div>

            </span>
          </a>
        </Button>
      </SidebarHeader>
      <SidebarContent className= "flex-1 overflow-auto flex flex-col items-center px-2 w-full h-full text-4xl bg-[#556378] text-[#C1E1C1] ">
        <NavMain items={data.navMain}  />
      </SidebarContent>
      <SidebarFooter className= "mt-auto w-full px-2  bg-[#EEF4ED] hover:bg-white border-2 border-[#556378] rounded-sm">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
