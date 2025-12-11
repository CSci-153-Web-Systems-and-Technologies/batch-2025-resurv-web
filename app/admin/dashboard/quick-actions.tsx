import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Hourglass } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="bg-[#EEF4ED] border-[#556378] shadow-none">
      <CardHeader>
        <CardTitle className="text-[#556378] text-2xl">QUICK ACTIONS</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button
          asChild
          variant="outline"
          className="h-auto flex-1 flex-col gap-2 p-4 border-2 border-[#556378] bg-white hover:bg-gray-50 text-[#556378]"
        >
          <Link href="/admin/reservations?status=pending">
            <Hourglass className="h-10 w-10" />
            <span className="font-bold">View Pending Requests</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto flex-1 flex-col gap-2 p-4 border-2 border-[#556378] bg-white hover:bg-gray-50 text-[#556378]"
        >
          <Link href="/admin/calendar">
            <CalendarDays className="h-10 w-10" />
            <span className="font-bold">View Calendar</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}