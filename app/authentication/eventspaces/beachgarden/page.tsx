import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button";
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Sidebar } from "lucide-react";

export default function Page() {
  return (
    <SidebarProvider> 
        <AppSidebar/>
        <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb >
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/authentication/dashboard" className= "text-black">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/authentication/dashboard" className= "text-black">
                    Beach Garden
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className= "bg-[#EEF4ED] w-full h-full">
            <div className="w-full h-250 max-w-5xl mx-auto bg-[#dce5f2] border border-slate-400 rounded-xl p-5 mt-2 shadow-sm relative "> 
                <div className= "flex justify-center items-center h-full w-full"> 
                    <Image
                        src="/Beach_Resort.jpg"
                        alt="beachresortimage"
                        width={500}
                        height={100}
                        className="rounded-xl object-cover " 
                    />
                </div>
            </div>
        </div>  
    </SidebarInset>
    </SidebarProvider>  
)
}
