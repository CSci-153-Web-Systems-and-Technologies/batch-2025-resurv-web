import { AdminStats } from "./components/admin-stats"
import { RecentRequests } from "./components/recent-requests"
import { BookingTrendChart } from "./components/booking-trends"
import { QuickActions } from "./components/quick-actions"
import { auth } from "@clerk/nextjs/server"
import { fetchDashboardData } from "./data-fetching"

export default async function AdminDashboardPage() {
  // 1. Authenticate with Supabase
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });
  const { stats, chartData } = await fetchDashboardData(token);
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-[#EEF4ED]">
         <div className="flex items-center gap-2 text-[#556378] font-bold text-xl">
            Dashboard
         </div>
         <div className="relative w-full max-w-sm">
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
            <RecentRequests />
          </div>

        </div>
      </main>
    </div>
  )
}