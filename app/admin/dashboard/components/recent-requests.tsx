import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 1. CHANGE: Allow 'any' to prevent TypeScript conflicts with Supabase types
interface RecentRequestsProps {
  data: any[]; 
}

export function RecentRequests({ data }: RecentRequestsProps) {
  return (
    <Card className="bg-[#EEF4ED] border-[#556378] shadow-none">
      <CardHeader>
        <CardTitle className="flex text-[#556378] text-2xl items-center">
          Recent Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-4">
          
          {/* Check if empty */}
          {(!data || data.length === 0) ? (
             <div className="w-full text-center text-gray-400 py-4 italic">
                No recent activity found.
             </div>
          ) : (
             /* Map through data */
             data.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-[#556378] rounded-lg text-white min-w-[280px]"
                >
                  <div className="space-y-1">
                    {/* Access nested facility title safely with ?. */}
                    <p className="font-medium truncate max-w-[150px]">
                        {/* Handle case where facility might be an array or object */}
                        {Array.isArray(request.facilities) 
                            ? request.facilities[0]?.title 
                            : request.facilities?.title || "Unknown Venue"}
                    </p>
                    
                    {/* Access nested profile name safely */}
                    <p className="text-xs text-gray-300">
                      {Array.isArray(request.profiles)
                            ? request.profiles[0]?.full_name
                            : request.profiles?.full_name || "Unknown User"}
                    </p>
                    
                    <p className="text-xs text-gray-400">
                        {new Date(request.start_time).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Badge
                    className={`${
                      request.status === "approved"
                        ? "bg-[#C1E1C1] text-[#556378] hover:bg-[#C1E1C1]"
                        : request.status === "rejected" 
                        ? "bg-red-400 text-white hover:bg-red-400"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
             ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}