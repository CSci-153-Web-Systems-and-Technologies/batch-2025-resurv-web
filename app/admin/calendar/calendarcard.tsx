"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar" 
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
  from: Date;
  to:  Date;
  facilityId: string;
  facilityName: string;
}

interface EventCalendarCardProps {
  events: CalendarEvent[]; 
  facilities: { id: string; title: string }[];
}

export function EventCalendarCard({ events, facilities }: EventCalendarCardProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())
  
  const [selectedSpaceId, setSelectedSpaceId] = React.useState<string>("all");

  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.from);
      const isSameMonth = 
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear();

      const isSameSpace = selectedSpaceId && selectedSpaceId !== "all" 
        ? event.facilityId === selectedSpaceId 
        : true;

      return isSameMonth && isSameSpace;
    });
  }, [events, currentMonth, selectedSpaceId]);
  
  const bookedRanges = React.useMemo(() => {
    const relevantEvents = selectedSpaceId && selectedSpaceId !== "all" 
        ? events.filter(e => e.facilityId === selectedSpaceId)
        : events;

    return relevantEvents.map(event => ({
        from: event.from,
        to: event.to
    }));
  }, [events, selectedSpaceId]);

  return (
    <Card className="flex flex-col w-full max-w-5xl mx-auto mt-2 p-4 gap-6 bg-[#dce5f2] border border-[#556378] rounded-xl shadow-sm items-stretch justify-center">
      
      <Select onValueChange={setSelectedSpaceId}>
        <SelectTrigger className="w-[190px] bg-[#EEF4ED] border border-[#556378] cursor-pointer">
          <SelectValue placeholder="Select an Event Space" />
        </SelectTrigger>
        <SelectContent className="bg-[#EEF4ED]">
          <SelectGroup>
            {facilities.map((space) => (
                <SelectItem key={space.id} value={space.id} className="cursor-pointer">
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
        disabled={bookedRanges}
        modifiers={{ booked: bookedRanges }}
        month={currentMonth} 
        onMonthChange={setCurrentMonth}
        modifiersClassNames={{
          booked:
            "bg-red-100 text-red-400 line-through decoration-red-400 cursor-not-allowed opacity-100 [&>button]:hover:bg-red-100 [&>button]:hover:text-red-400 ",
        }}
        classNames={{
          caption_label: "text-3xl font-extrabold" // Change 'text-2xl' to whatever size you want
        }}
        className=" rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-full h-full [&_td]:pointer-events-none border-[#556378] "
      />

      <CardFooter className="flex flex-col items-start gap-3 border-t px-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm text-[#556378] font-medium ">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        
        <div className="flex w-full flex-col gap-2 text-[#556378]">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
                <div
                key={index}
                className=" bg-[#EEF4ED] after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                >
                <div className="font-medium">{event.title}</div>
                <div className="text-muted-foreground text-xs">
                    {formatDateRange(new Date(event.from), new Date(event.to))}
                </div>
                </div>
            ))
          ) : (
             <p className="text-xs italic text-gray-500 pl-2">
               {selectedSpaceId ? `No events for ${selectedSpaceId} this month` : "No events this month"}
             </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}