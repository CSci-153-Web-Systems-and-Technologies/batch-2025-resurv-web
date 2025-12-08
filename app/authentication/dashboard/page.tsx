import { AppSidebar } from "@/components/app-sidebar"
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

import { supabase } from "@/lib/supabase";
import { EventspaceCard } from "../eventspaces/eventspacecard";
import { syncUser } from "@/lib/syncUser";
export default async function Page() {
  
  await syncUser();
  
  const { data: facilities, error } = await supabase
    .from('facilities')
    .select('*')
    .order('created_at', { ascending: true }); 

  if (error) {
    console.error("Error loading facilities:", error);
  }
  
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
          <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-3 p-3">
            {facilities?.map((space) => (
              <EventspaceCard
                key={space.id}
                id={space.id}           
                title={space.title}
                imageSrc={space.image_url || '/placeholder.jpg'} 
              />
            ))}
            {(!facilities || facilities.length === 0) && (
                <p>No event spaces found.</p>
            )}

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}