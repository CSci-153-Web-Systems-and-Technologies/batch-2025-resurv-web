import { createClient } from "@supabase/supabase-js"

export async function fetchDashboardData(token: string | null) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;
  const firstDayOfMonth = new Date(currentYear, now.getMonth(), 1).toISOString();

  // Define valid statuses for the chart (Case insensitive handling)
  const approvedStatuses = ['approved', 'Approved'];

  const [
    pendingResult, 
    approvedThisMonthResult, 
    activeVenuesResult, 
    totalVenuesResult,
    chartDataResult,
    recentRequestsResult
  ] = await Promise.all([
    // Stats
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    
    // Approved This Month (Check both cases)
    supabase.from('reservations').select('*', { count: 'exact', head: true }).in('status', approvedStatuses).gte('start_time', firstDayOfMonth),
    
    supabase.from('facilities').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('facilities').select('*', { count: 'exact', head: true }),
    
    // Chart Data (Check both cases)
    supabase.from('reservations').select('start_time').in('status', approvedStatuses),
    
    // Recent Requests
    supabase
        .from('reservations')
        .select(`
            id, created_at, status, start_time,
            facilities (title),
            profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
  ]);

  // --- DEBUGGING: Check your terminal to see if this prints data ---
  console.log("Chart Raw Data:", chartDataResult.data); 
  // ---------------------------------------------------------------

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

  return {
    stats: {
        pending: pendingResult.count || 0,
        approvedThisMonth: approvedThisMonthResult.count || 0,
        activeVenues: activeVenuesResult.count || 0,
        totalVenues: totalVenuesResult.count || 0,
    },
    chartData: monthlyData,
    recentRequests: recentRequestsResult.data || []
  };
}