import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Placeholder data
const recentRequests = [
  {
    id: "1",
    spaceName: "Event Space Name",
    userName: "Name N. Surname",
    date: "00/00/00",
    status: "Approved",
  },
  {
    id: "2",
    spaceName: "Event Space Name",
    userName: "Name N. Surname",
    date: "00/00/00",
    status: "Approved",
  },
  {
    id: "3",
    spaceName: "Event Space Name",
    userName: "Name N. Surname",
    date: "00/00/00",
    status: "Rejected",
  },
  {
    id: "4",
    spaceName: "Event Space Name",
    userName: "Name N. Surname",
    date: "00/00/00",
    status: "Approved",
  },
]

export function RecentRequests() {
  return (
    <Card className="bg-[#EEF4ED] border-[#556378] shadow-none">
      <CardHeader>
        <CardTitle className=" flex text-[#556378] text-2xl items-center justify-center">Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-[#556378] rounded-lg text-white"
            >
              <div className="space-y-1">
                <p className="font-medium">{request.spaceName}</p>
                <p className="text-xs text-gray-300">
                  {request.userName} - {request.date}
                </p>
              </div>
              <Badge
                className={`${
                  request.status === "Approved"
                    ? "bg-[#C1E1C1] text-[#556378] hover:bg-[#C1E1C1]"
                    : "bg-red-400 text-white hover:bg-red-400"
                }`}
              >
                {request.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}