import { createClient } from "@supabase/supabase-js"

export async function fetchDashboardData(token: string | null) {
  // 1. Initialize Supabase with the Clerk Token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  // 2. Setup Date Logic
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;
  const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1).toISOString();

  // 3. Run Queries in Parallel
  const [
    pendingResult, 
    approvedThisMonthResult, 
    activeVenuesResult, 
    totalVenuesResult,
    chartDataResult
  ] = await Promise.all([
    // Stats
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'approved').gte('start_time', firstDayOfMonth),
    supabase.from('facilities').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('facilities').select('*', { count: 'exact', head: true }),
    
    // Chart Data
    supabase.from('reservations').select('start_time').eq('status', 'approved')
  ]);

  // 4. Process Chart Data
  const monthlyData = [
    { name: "Jan", current: 0, previous: 0 },
    { name: "Feb", current: 0, previous: 0 },
    { name: "Mar", current: 0, previous: 0 },
    { name: "Apr", current: 0, previous: 0 },
    { name: "May", current: 0, previous: 0 },
    { name: "Jun", current: 0, previous: 0 },
    { name: "Jul", current: 0, previous: 0 },
    { name: "Aug", current: 0, previous: 0 },
    { name: "Sep", current: 0, previous: 0 },
    { name: "Oct", current: 0, previous: 0 },
    { name: "Nov", current: 0, previous: 0 },
    { name: "Dec", current: 0, previous: 0 },
  ];

  if (chartDataResult.data) {
    chartDataResult.data.forEach((booking) => {
        const date = new Date(booking.start_time);
        const year = date.getFullYear();
        const monthIndex = date.getMonth(); 

        if (year === currentYear) {
            monthlyData[monthIndex].current += 1;
        } else if (year === previousYear) {
            monthlyData[monthIndex].previous += 1;
        }
    });
  }

  // 5. Return Clean Object
  return {
    stats: {
        pending: pendingResult.count || 0,
        approvedThisMonth: approvedThisMonthResult.count || 0,
        activeVenues: activeVenuesResult.count || 0,
        totalVenues: totalVenuesResult.count || 0,
    },
    chartData: monthlyData
  };
}