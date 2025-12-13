import { AppSidebar } from "@/components/app-sidebar"
import { supabase } from "@/lib/supabase" 
import { AdminBlockCard } from "./block-dates-card"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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

export default async function ReservationPage() {
  const user = await currentUser();
  if (!user) return redirect("/login");

  const { data: facilities } = await supabase
    .from('facilities')
    .select('id, title')
    .order('title');

  const safeFacilities = facilities || [];

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">
<Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4 px-0.5 rounded bg-white" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="" className="font-bold text-[#556378] text-lg">Blocked Dates</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#EEF4ED]">
            <AdminBlockCard 
                facilities={safeFacilities} 
                userId={user.id} 
            />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}