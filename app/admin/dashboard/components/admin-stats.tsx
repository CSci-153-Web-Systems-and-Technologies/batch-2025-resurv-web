import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, MapPin, Building2 } from "lucide-react"

// 1. Define the props expected
interface AdminStatsProps {
  pendingCount: number;
  approvedCount: number;
  activeVenuesCount: number;
  totalVenuesCount: number;
}

// 2. Accept props in the function
export function AdminStats({ 
  pendingCount, 
  approvedCount, 
  activeVenuesCount, 
  totalVenuesCount 
}: AdminStatsProps) {
  
  const stats = [
    {
      title: "Pending Requests",
      value: pendingCount, // Use real data
      icon: Clock,
    },
    {
      title: "Approved This Month",
      value: approvedCount, // Use real data
      icon: CheckCircle2,
    },
    {
      title: "Available Venues",
      value: activeVenuesCount, // Use real data
      icon: MapPin,
    },
    {
      title: "Total Venues",
      value: totalVenuesCount, // Use real data
      icon: Building2,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-[#EEF4ED] border-[#556378] shadow-none">
          <CardContent className="p-6 flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-2xl font-medium text-[#556378]">{stat.title}</p>
              <div className="text-4xl font-bold text-[#556378]">{stat.value}</div>
            </div>
            <div className="p-2 bg-white rounded-full border-2 border-[#556378]">
                <stat.icon className="h-6 w-6 text-[#556378]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}