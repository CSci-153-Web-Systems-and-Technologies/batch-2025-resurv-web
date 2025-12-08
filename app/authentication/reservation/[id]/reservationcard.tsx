"use client" // <--- This allows hooks!

import * as React from "react"
import { supabase } from "@/lib/supabase"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { DateRange } from "react-day-picker"

// Accept the ID as a prop from the parent
export default function ReservationForm({ facilityId }: { facilityId: string }) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);

  React.useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('start_time')
        .eq('facility_id', facilityId) // Now we can filter by the specific room!
        .eq('status', 'approved');

      if (data) {
        setBookedDates(data.map((b) => new Date(b.start_time)));
      }
    };
    fetchBookings();
  }, [facilityId]);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-center justify-center ">
        <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 justify-center items-center">
            <Card className="flex flex-col w-full md:flex-1 h-auto md:h-auto bg-[#556378] rounded-lg shadow-sm p-4 text-white justify-center items-center md:w-full">
            <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                className="rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-auto md:w-full md:h-full"
                modifiers={{ booked: bookedDates }}
                modifiersClassNames={{ booked: "bg-red-200 text-red-900 font-bold decoration-red-500" }}
            />
            </Card>

           <Card className= " flex flex-col w-[300px] h-auto justify-center items-center bg-[#556378] pt-3 pb-3 rounded-lg text-[#556378]">
                    <div className="flex flex-col justify-start w-[285px] mt-4 gap-2 px-4"> 
                      <Label htmlFor="time-picker" className="px-1 text-white">Start Time</Label>
                      <Input type="time" id="time-picker-start" defaultValue="00:00" className="px-1 text-[#EEF4ED] [&::-webkit-calendar-picker-indicator]:hidden" />
                      
                      <Label htmlFor="time-picker" className="px-1 text-[#EEF4ED]">End Time</Label>
                      <Input type="time" id="time-picker-end" defaultValue="00:00" className= " px-1 text-[#EEF4ED] [&::-webkit-calendar-picker-indicator]:hidden" /> 

                      <Label htmlFor="purpose" className= "text-[#EEF4ED]">Purpose of Event</Label>
                      <Textarea id="purpose" className="w-full max-w-[300px] max-h-[80px] text-[#EEF4ED]" />

                      <Label htmlFor="numofatt" className= "text-[#EEF4ED]">Number of Attendees </Label>
                      <Input type="number" id="numofatt" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-[#EEF4ED]" />

                      <Label htmlFor="specreq" className= "text-[#EEF4ED]">Special Requirements/Accomodities </Label>
                      <Textarea id="specreq" className="w-full max-w-[300px] max-h-[80px] text-[#EEF4ED]" />
                    </div>
                  </Card>
        </div>
    </div>
  )
}