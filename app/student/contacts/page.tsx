import { AppSidebar } from "@/components/app-sidebar"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
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

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default async function Page() {
  const { data: facilities, error } = await supabase
    .from('facilities')
    .select('id, title, image_url, contact_num, local_num')
    .order('title', { ascending: true });

  if (error) {
    console.error("Error fetching contacts:", error);
  }


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">

            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-white"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="font-bold text-[#556378] text-lg">
                    Contacts
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
          <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-3 p-3">
            {facilities?.map((facility) => (
            <Card 
                key={facility.id} 
                className="flex flex-col w-full bg-[#556378] rounded-xl overflow-hidden border-none"
              >
            <div className="relative w-55 h-55 shrink-0 rounded-full overflow-hidden self-center">
              <Image
                src={facility.image_url} 
                alt={facility.title}
                fill
                className="object-cover"
              />
            </div>
              <CardContent className="flex flex-1 items-center justify-center p-1 text-white font-bold text-2xl text-center">
                  {facility.title}
                </CardContent>
                <CardFooter className="flex flex-1 items-center justify-center text-white font-regular text-xl text-center">
                 <span className="underline"> {facility.contact_num} </span>
                </CardFooter>
                 <CardFooter className="flex flex-1 items-center justify-center text-white font-regular text-xl text-center">
                 <span className="underline"> {facility.local_num} </span>
                </CardFooter>

            </Card> 
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}