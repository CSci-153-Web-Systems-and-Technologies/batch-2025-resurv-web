import { supabase } from "@/lib/supabase"

export default async function AdminDashboard() {
  // Fetch stats for the admin
  const { count: pendingCount } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-yellow-100 rounded-xl border border-yellow-300">
          <h3 className="text-lg font-medium text-yellow-800">Pending Requests</h3>
          <p className="text-4xl font-bold text-yellow-900">{pendingCount}</p>
        </div>
        {/* Add more stats cards */}
      </div>
    </div>
  )
}