import { supabase } from "@/lib/supabase"
import { AdminStats } from "./admin-stats"
import { RecentRequests } from "./recent-requests"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export default async function AdminDashboard() {
  // Fetch stats for the admin
  const { count: pendingCount } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className="flex flex-col h-full">
      {/* Header Section from the design */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-[#CEDBEE]">
          <div className="flex items-center gap-2 px-4">
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
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#EEF4ED] p-4">
        <div className="flex flex-col gap-4 w-[300px]">
        <div className="w-full flex flex-col gap-4">
          <AdminStats />
          <RecentRequests />
        </div>

      </div>
      </main>
    </div>
  )
}