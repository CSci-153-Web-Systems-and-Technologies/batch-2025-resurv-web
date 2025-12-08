"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DateRange } from "react-day-picker"
import { supabase } from "@/lib/supabase" 
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

// Helper: Check overlap
function isDateRangeOverlapping(start: Date, end: Date, bookedRanges: { from: Date; to: Date }[]) {
  return bookedRanges.some((range) => {
    const bookedStart = new Date(range.from);
    const bookedEnd = new Date(range.to);
    return (start <= bookedEnd && end >= bookedStart);
  });
}

interface ReservationFormProps {
  facility: {
    id: string;
    title: string;
  };
  userId: string;
}

export function ReservationCard({ facility, userId }: ReservationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // 1. STATE: Store the booked dates here
  const [bookedDates, setBookedDates] = React.useState<{ from: Date; to: Date }[]>([]);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

  // 2. FETCH: Get data from Database when component loads
  React.useEffect(() => {
    const fetchBookings = async () => {
      console.log("Fetching bookings for facility:", facility.id);
      
      const { data, error } = await supabase
        .from('reservations')
        .select('start_time, end_time, status') // Added status to log
        .eq('facility_id', facility.id)
        // FIX 1: Allow 'pending' so you can see your own new bookings immediately!
        .in('status', ['approved', 'pending']); 

      if (error) {
        console.error("Error fetching bookings:", error);
      } else if (data) {
        console.log("Found bookings:", data); // Check your F12 Console for this!
        
        // Convert Strings to Dates
        const formatted = data.map(b => ({
            from: new Date(b.start_time),
            to: new Date(b.end_time)
        }));
        setBookedDates(formatted);
      }
    };

    fetchBookings();
  }, [facility.id]); 

  // 3. NORMALIZE: Prepare dates for Calendar visuals
  const normalizedBookedDates = React.useMemo(() => {
    return bookedDates.map((range) => {
      const newFrom = new Date(range.from);
      const newTo = new Date(range.to);
      newFrom.setHours(0, 0, 0, 0);
      newTo.setHours(23, 59, 59, 999);
      return { from: newFrom, to: newTo };
    });
  }, [bookedDates]);

  const combineDateAndTime = (date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate.toISOString(); 
  };

  async function handleReserve(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget as HTMLFormElement;

    if (!dateRange?.from) {
      alert("Please select a date.");
      setIsSubmitting(false);
      return;
    }

    const startDate = dateRange.from;
    const endDate = dateRange.to || dateRange.from;
    
    if (isDateRangeOverlapping(startDate, endDate, normalizedBookedDates)) {
        alert("The selected date range conflicts with an existing reservation.");
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData(form);
    const startTimeStr = formData.get("start_time") as string;
    const endTimeStr = formData.get("end_time") as string;
    const purpose = formData.get("purpose") as string;
    const attendees = formData.get("attendees") as string;
    const requirements = formData.get("requirements") as string;

    const StartTime = combineDateAndTime(startDate, startTimeStr);
    const EndTime = combineDateAndTime(endDate, endTimeStr);

    const { error } = await supabase
      .from('reservations')
      .insert({
        user_id: userId,
        facility_id: facility.id,
        start_time: StartTime,
        end_time: EndTime,
        purpose: purpose,            
        num_attendees: attendees,       
        special_req: requirements,      
        status: 'pending',
      });

    if (error) {
      console.error(error);
      alert("Error creating reservation: " + error.message);
    } else {
      alert("Reservation submitted successfully!");
      form.reset();
      setDateRange({ from: new Date(), to: new Date() });
      router.refresh();
      // Reload the page to force a re-fetch if needed, or trigger the fetch manually
      window.location.reload(); 
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleReserve} className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-stretch justify-center">
        <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 justify-center items-center">
            <Card className="flex flex-col w-full md:flex-1 h-auto bg-[#556378] rounded-lg shadow-sm p-4 text-white justify-center items-center">
            <Calendar
                mode="range"
                defaultMonth={new Date()}
                selected={dateRange}
                onSelect={setDateRange}
                disabled={normalizedBookedDates}
                modifiers={{ booked: normalizedBookedDates }}
                modifiersClassNames={{
                booked: "bg-red-200 text-red-600 line-through cursor-not-allowed opacity-50"
                }}
                className="rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-auto md:w-full"
            />
            </Card>
            
            <Card className="flex flex-col w-[300px] h-auto justify-center items-center bg-[#556378] pt-3 pb-3 rounded-lg text-[#556378]">
            <div className="flex flex-col justify-start w-[285px] mt-4 gap-2 px-4"> 
                <Label htmlFor="start_time" className="px-1 text-white">Start Time</Label>
                <Input name="start_time" type="time" required defaultValue="08:00" className="px-1 text-[#EEF4ED] [&::-webkit-calendar-picker-indicator]:hidden" />
                <Label htmlFor="end_time" className="px-1 text-[#EEF4ED]">End Time</Label>
                <Input name="end_time" type="time" required defaultValue="17:00" className="px-1 text-[#EEF4ED] [&::-webkit-calendar-picker-indicator]:hidden" /> 
                <Label htmlFor="purpose" className="text-[#EEF4ED]">Purpose of Event</Label>
                <Textarea name="purpose" required className="w-full max-w-[300px] max-h-[80px] text-[#EEF4ED]" />
                <Label htmlFor="numofatt" className="text-[#EEF4ED]">Number of Attendees</Label>
                <Input name="attendees" type="number" required className="text-[#EEF4ED]" />
                <Label htmlFor="specreq" className="text-[#EEF4ED]">Special Requirements</Label>
                <Textarea name="requirements" className="w-full max-w-[300px] max-h-[80px] text-[#EEF4ED]" />
                <Button type="submit" disabled={isSubmitting} className="mt-4 bg-[#EEF4ED] text-[#556378] hover:bg-slate-200 cursor-pointer">
                {isSubmitting ? "Booking..." : "Confirm Reservation"}
                </Button>
            </div>
            </Card>
        </div>
    </form>
  )
}