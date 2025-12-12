import { supabase } from "@/lib/supabase"
import { AdminStats } from "./components/admin-stats"
import { RecentRequests } from "./components/recent-requests"
import { BookingTrendChart } from "./components/booking-trends"
import { QuickActions } from "./components/quick-actions"
import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,

} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export default async function AdminDashboardPage() {
  // 1. Authenticate with Supabase
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const [
    pendingResult, 
    approvedResult, 
    activeVenuesResult, 
    totalVenuesResult
  ] = await Promise.all([
    supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true }) 
      .eq('status', 'pending'),

    supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .gte('start_time', firstDay), 

    supabase
      .from('facilities')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),

    supabase
      .from('facilities')
      .select('*', { count: 'exact', head: true })
  ]);

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
                pendingCount={pendingResult.count || 0}
                approvedCount={approvedResult.count || 0}
                activeVenuesCount={activeVenuesResult.count || 0}
                totalVenuesCount={totalVenuesResult.count || 0}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <BookingTrendChart />
            <QuickActions />
            <RecentRequests />
          </div>

        </div>
      </main>
    </div>
  )
}