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

// 1. Define the shape of the data
interface ChartData {
  name: string;
  current: number;
  previous: number;
}

interface BookingTrendChartProps {
  data: ChartData[];
}

// 2. Accept data as a prop
export function BookingTrendChart({ data }: BookingTrendChartProps) {
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
              data={data} // <--- Use the prop data here
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
              {/* Previous Year Line (Blue) */}
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Last Year"
              />
              {/* Current Year Line (Green) */}
              <Line
                type="monotone"
                dataKey="current"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="This Year"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}