import { AppSidebar } from "@/components/app-sidebar"
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 rows-3 p-3">
           
            <Card className="bg-[#556378] flex-col w-full h-full items-center justify-center flex rounded-xl px-4 pb-4 pt-0 hover:bg-[#4a5568] relative">
                <CardHeader className="w-full h-55 absolute top-0 p-0! rounded-t-xl overflow-hidden">
                <Image
                src="/Convention.jpg"
                alt="conventionimage"
                fill
                className="rounded-xl object-cover" 
                />
                </CardHeader>
                <CardContent className="text-white font-bold text-2xl pt-55">
                  Convention Center
                </CardContent>

              </Card>
               <Card className="bg-[#556378] flex-col w-full h-full items-center justify-center flex rounded-xl px-4 pb-4 pt-0 hover:bg-[#4a5568] relative">
                <CardHeader className="w-full h-55 absolute top-0 p-0! rounded-t-xl overflow-hidden">
                <Image
                src="/CCE.jpg"
                alt="cceimage"
                fill
                className="rounded-xl object-cover" 
                />
                </CardHeader>
                <CardContent className="text-white font-bold text-2xl pt-55 text-center">
                  Center for Continuing Education
                </CardContent>
              </Card>

              <Card className="bg-[#556378] flex-col w-full h-full items-center justify-center flex rounded-xl px-4 pb-4 pt-0 hover:bg-[#4a5568] relative">
                <CardHeader className="w-full h-55 absolute top-0 p-0! rounded-t-xl overflow-hidden">
                <Image
                src="/Beach_Resort.jpg"
                alt="beachresortimage"
                fill
                className="rounded-xl object-cover" 
                />
                </CardHeader>
                <CardContent className="text-white font-bold text-2xl pt-55 text-center">
                  Beach Garden
                </CardContent>
              </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
