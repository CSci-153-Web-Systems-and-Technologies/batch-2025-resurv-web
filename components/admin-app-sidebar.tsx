"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import {
  MapPinHouse,
  CalendarFold,
  LayoutDashboard,

} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"


const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Reservations",
      url: "/admin/reservation",
      icon: MapPinHouse,
    },
    {
      title: "Calendar",
      url: "/admin/calendar",
      icon: CalendarFold,
    },
    
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const activeNavMain = data.navMain.map((item) => {
    let isActive = pathname === item.url;
    if (item.title === "Reservations") {
       if (pathname.includes("/reservation")) {
         isActive = true;
       }
    }

    return {
      ...item,
      isActive: isActive, 
    }
  })


  return (
    <Sidebar collapsible="none" className="flex flex-col sticky top-0 h-screen items-center justify-center bg-[#556378] "{...props}>
      <SidebarHeader className="w-full px-2 py-4 h-32 flex items-center justify-center bg-[#556378] ">
        <Button className="w-full justify-center py-2 gap-1 bg-transparent hover:bg-transparent">
          <a
            href="/student/dashboard"
            className="flex items-center gap-2 justify-center w-full" 
          >
            <span
              className={
                "ml-2 text-4xl font-bold text-black transition-all duration-200 ease-in-out justify-center "
                
              }
            >
              <div className="w-6 h-6 flex items-center justify-center gap-1 text-[#C1E1C1] mr-4 text-5xl">
                <CalendarFold size={500} className=" flex text-[#C1E1C1] w-9! h-9! items-center justify-center mt-1.5" />
                 Resurv
              </div>

            </span>
          </a>
        </Button>
      </SidebarHeader>
      <SidebarContent className= "flex-1 overflow-auto flex flex-col items-center px-2 w-full h-full text-4xl bg-[#556378] text-[#C1E1C1] ">
        <NavMain items={activeNavMain}  />
      </SidebarContent>
      <SidebarFooter className= "mt-auto w-full px-2 bg-[#556378] border-[#556378] rounded-sm">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
