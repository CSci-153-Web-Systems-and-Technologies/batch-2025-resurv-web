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

  const [
    pendingResult, 
    approvedThisMonthResult, 
    activeVenuesResult, 
    totalVenuesResult,
    chartDataResult,
    // 1. NEW: Fetch Recent Requests
    recentRequestsResult
  ] = await Promise.all([
    // Stats
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'approved').gte('start_time', firstDayOfMonth),
    supabase.from('facilities').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('facilities').select('*', { count: 'exact', head: true }),
    // Chart
    supabase.from('reservations').select('start_time').eq('status', 'approved'),
    
    // 2. NEW QUERY: Get the 5 most recent reservations with joins
    supabase
        .from('reservations')
        .select(`
            id,
            created_at,
            status,
            start_time,
            facilities (title),
            profiles (full_name)
        `)
        .order('created_at', { ascending: false }) // Newest first
        .limit(5)
  ]);

  // ... (Keep existing Chart Data processing logic here) ...
  const monthlyData = [
    { name: "Jan", current: 0, previous: 0 },
    // ... fill rest of months ...
  ];
  if (chartDataResult.data) {
     // ... loop logic ...
  }

  return {
    stats: {
        pending: pendingResult.count || 0,
        approvedThisMonth: approvedThisMonthResult.count || 0,
        activeVenues: activeVenuesResult.count || 0,
        totalVenues: totalVenuesResult.count || 0,
    },
    chartData: monthlyData,
    // 3. Return the recent requests
    recentRequests: recentRequestsResult.data || []
  };
}