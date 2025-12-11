import { supabase } from "@/lib/supabase"
import { AdminStats } from "./admin-stats"
import { RecentRequests } from "./recent-requests"
import { BookingTrendChart } from "./booking-trends"
import { QuickActions } from "./quick-actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,

} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export default async function AdminDashboard() {
  const { count: pendingCount } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className="flex flex-col h-full">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full">
        <div className=" flex flex-col gap-4 w-[330px]">
          <AdminStats />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
            <BookingTrendChart />
            <RecentRequests />
            <QuickActions />
          </div>
      </div>
      </main>
    </div>
  )
}