import { AppSidebar } from "@/components/app-sidebar"
import { EventspaceCard } from "../eventspaces/eventspacecard";
import { EventSpaces } from "@/app/authentication/eventspaces/eventspace";
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default function Page() {
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
                  <BreadcrumbLink href="#" className="text-black">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            <div className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-center justify-center ">
                <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 justify-center items-center">
                  <Card className="flex flex-col w-full md:flex-1 h-auto md:h-auto bg-[#556378] rounded-lg shadow-sm p-4 text-white justify-center items-center md:w-full">
                    <Calendar
                    mode="single"
                    className="rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-auto md:w-full md:h-full"
                    />
                  </Card>
                  
                </div>

                <div className="p-6 flex flex-col gap-4">
            </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}