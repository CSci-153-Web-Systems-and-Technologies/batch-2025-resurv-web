export const dynamic = 'force-dynamic';
import { AdminStats } from "./components/admin-stats"
import { RecentRequests } from "./components/recent-requests"
import { BookingTrendChart } from "./components/booking-trends"
import { QuickActions } from "./components/quick-actions"
import { auth } from "@clerk/nextjs/server"
import { fetchDashboardData } from "./data-fetching"
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
export default async function AdminDashboardPage() {
  // 1. Authenticate with Supabase
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });
  const { stats, chartData, recentRequests } = await fetchDashboardData(token);
  return (
    <div className="flex flex-col h-full">
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

      <main className="flex-1 overflow-y-auto bg-[#EEF4ED] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full">
          
          <div className="flex flex-col gap-4">
            <AdminStats 
                pendingCount={stats.pending}
                approvedCount={stats.approvedThisMonth}
                activeVenuesCount={stats.activeVenues}
                totalVenuesCount={stats.totalVenues}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <BookingTrendChart data={chartData}/>
            <QuickActions />
            <RecentRequests data={recentRequests}/>
          </div>

        </div>
      </main>
    </div>
  )
}