"use client"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
    title: string
    url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="flex w-full mb-2 items-center justify-center">
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link
                href={item.url}
                className="
                  flex items-center gap-3 w-full px-3 py-2
                  rounded-md
                  transition-colors duration-150
                  border border-transparent
                  hover:bg-[#EEF4ED] hover:text-[#556378]
                "
              >
                {item.icon && (
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <item.icon size={24} className="text-[#C1E1C1]" />
                  </div>
                )}
                <span className="text-xl font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
