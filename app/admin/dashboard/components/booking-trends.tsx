"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Jan", previous: 10, current: 5 },
  { name: "Feb", previous: 30, current: 25 },
  { name: "Mar", previous: 20, current: 10 },
  { name: "Apr", previous: 5, current: 20 },
  { name: "May", previous: 25, current: 10 },
  { name: "Jun", previous: 27, current: 15 },
]

export function BookingTrendChart() {
  return (
    <Card className="bg-[#EEF4ED] border-[#556378] shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-[#556378]">
          MONTHLY BOOKING TREND
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#556378" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#556378" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#556378",
                  color: "#fff",
                  border: "none",
                }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}