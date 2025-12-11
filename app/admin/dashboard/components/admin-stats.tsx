import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, MapPin } from "lucide-react"

const stats = [
  {
    title: "Pending Requests",
    value: "0",
    icon: Clock,
  },
  {
    title: "Approved This Month",
    value: "0",
    icon: CheckCircle2,
  },
  {
    title: "Available Venues",
    value: "0",
    icon: MapPin,
  },
  {
    title: "Total Venues",
    value: "0",
    icon: MapPin,
  },
]

export function AdminStats() {
  return (
    <div className="flex flex-col gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-[#EEF4ED] border-[#556378] shadow-none">
          <CardContent className="p-6 flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#556378]">{stat.title}</p>
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