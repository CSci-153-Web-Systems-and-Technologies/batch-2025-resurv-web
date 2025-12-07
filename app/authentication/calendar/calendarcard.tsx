"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar" 
import { EventSpaces } from '../eventspaces/eventspace';
import { PlusIcon } from "lucide-react"
import { formatDateRange } from "little-date"

import {
  Card,
  CardFooter,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export interface CalendarEvent {
  title: string;
  from: string | Date;
  to: string | Date;
}


interface EventCalendarCardProps {
  events: CalendarEvent[]; 
}

export function EventCalendarCard({ events }: EventCalendarCardProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const bookedDates = Array.from(
    { length: 5 },
    (_, i) => new Date(2025, 11, 1 + i)
  )

  return (
    <Card className="flex flex-col w-full max-w-5xl mx-auto mt-2 p-4 gap-6 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm items-stretch justify-center">
      <Select>
        <SelectTrigger className="w-[190px] bg-[#EEF4ED] border border-[#556378]">
          <SelectValue placeholder="Select an Event Space" />
        </SelectTrigger>
        <SelectContent className="bg-[#EEF4ED]">
          <SelectGroup>
            {EventSpaces.map((space) => (
                <SelectItem key={space.id} value={space.title}>
                {space.title}
                </SelectItem>
            ))}
            </SelectGroup>
        </SelectContent>
      </Select>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={bookedDates}
        modifiers={{ booked: bookedDates }}
        modifiersClassNames={{
          booked:
            "bg-red-100 text-red-400 line-through decoration-red-400 cursor-not-allowed opacity-100 [&>button]:hover:bg-red-100 [&>button]:hover:text-red-400 ",
        }}
        className=" rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-full h-full [&_td]:pointer-events-none"
      />

      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm text-[#556378] font-medium ">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        

        <div className="flex w-full flex-col gap-2 text-[#556378]">
          {events.map((event, index) => (
            <div
              key={index} 
              className=" bg-[#EEF4ED] after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-muted-foreground text-xs">
                {formatDateRange(new Date(event.from), new Date(event.to))}
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}