"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar" 
import { EventSpaces } from '../eventspaces/eventspace';
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

// 1. UPDATE INTERFACE: Ensure 'id' is here so we can filter by it
export interface CalendarEvent {
  title: string;
  from: string | Date;
  to: string | Date;
  id: string; 
}

interface EventCalendarCardProps {
  events: CalendarEvent[]; 
}

export function EventCalendarCard({ events }: EventCalendarCardProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())
  
  // 2. ADD STATE: This tracks what the user selected in the dropdown
  const [selectedSpace, setSelectedSpace] = React.useState<string>("");

  const bookedDates = Array.from(
    { length: 5 },
    (_, i) => new Date(2025, 11, 1 + i)
  )

  // 3. UPDATE FILTER LOGIC: Check both Month AND Selected Space
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.from);
    
    // Condition A: Matches the current month view
    const isSameMonth = 
      eventDate.getMonth() === currentMonth.getMonth() &&
      eventDate.getFullYear() === currentMonth.getFullYear();

    // Condition B: Matches the selected dropdown (or show all if nothing selected)
    // We compare event.id to selectedSpace because your data uses the name as the ID
    const isSameSpace = selectedSpace ? event.id === selectedSpace : true;

    return isSameMonth && isSameSpace;
  });

  return (
    <Card className="flex flex-col w-full max-w-5xl mx-auto mt-2 p-4 gap-6 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm items-stretch justify-center">
      
      {/* 4. CONNECT SELECT TO STATE */}
      <Select value={selectedSpace} onValueChange={setSelectedSpace}>
        <SelectTrigger className="w-[190px] bg-[#EEF4ED] border border-[#556378]">
          <SelectValue placeholder="Select an Event Space" />
        </SelectTrigger>
        <SelectContent className="bg-[#EEF4ED]">
          <SelectGroup>
            {/* Optional: Add a clear filter option */}
            {EventSpaces.map((space) => (
                // Note: We use space.title as the value to match your event.id data structure
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
        month={currentMonth} 
        onMonthChange={setCurrentMonth}
        modifiersClassNames={{
          booked:
            "bg-red-100 text-red-400 line-through decoration-red-400 cursor-not-allowed opacity-100 [&>button]:hover:bg-red-100 [&>button]:hover:text-red-400 ",
        }}
        // Removed pointer-events-none so you can actually click the calendar buttons
        className=" rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-full h-full"
      />

      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm text-[#556378] font-medium ">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        
        {/* 5. REMOVED DUPLICATE LIST: Only rendering filteredEvents now */}
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
               {selectedSpace ? `No events for ${selectedSpace} this month` : "No events this month"}
             </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}