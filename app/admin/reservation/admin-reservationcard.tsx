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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function isDateRangeOverlapping(start: Date, end: Date, bookedRanges: { from: Date; to: Date }[]) {
  return bookedRanges.some((range) => {
    const bookedStart = new Date(range.from);
    const bookedEnd = new Date(range.to);
    return (start <= bookedEnd && end >= bookedStart);
  });
}

// 1. UPDATE INTERFACE to accept a LIST of facilities
interface ReservationFormProps {
  facilities: {
    id: string;
    title: string;
  }[];
  userId: string;
}

export function ReservationCard({ facilities, userId }: ReservationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // 2. STATE: Track which facility is currently selected
  // Default to the first one in the list if available
  const [selectedFacilityId, setSelectedFacilityId] = React.useState<string>(facilities[0]?.id || "");

  const [bookedDates, setBookedDates] = React.useState<{ from: Date; to: Date }[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  // 3. FETCH: Re-run this whenever 'selectedFacilityId' changes
  React.useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedFacilityId) return;

      console.log("Fetching bookings for facility:", selectedFacilityId);
      
      const { data, error } = await supabase
        .from('reservations')
        .select('start_time, end_time, status')
        .eq('facility_id', selectedFacilityId) // Use the state variable
        .in('status', ['approved', 'pending']); 

      if (error) {
        console.error("Error fetching bookings:", error);
      } else if (data) {
        const formatted = data.map(b => ({
            from: new Date(b.start_time),
            to: new Date(b.end_time)
        }));
        setBookedDates(formatted);
      }
    };

    fetchBookings();
  }, [selectedFacilityId]); // Dependency array ensures refresh on change

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

    if (!selectedFacilityId) {
        alert("Please select a facility.");
        setIsSubmitting(false);
        return;
    }

    if (!dateRange?.from) {
      alert("Please select a date.");
      setIsSubmitting(false);
      return;
    }

    const newStart = dateRange.from;
    const newEnd = dateRange.to || dateRange.from;
    
    const hasConflict = normalizedBookedDates.some((booking) => {
        const existingStart = booking.from;
        const existingEnd = booking.to;
        return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasConflict) {
        alert("The selected dates conflict with an existing reservation.");
        setDateRange(undefined); 
        setIsSubmitting(false);
        return; 
    }

    const formData = new FormData(form);
    const startTimeStr = formData.get("start_time") as string;
    const endTimeStr = formData.get("end_time") as string;
    const purpose = formData.get("purpose") as string;
    const attendees = formData.get("attendees") as string;
    const requirements = formData.get("requirements") as string;

    const StartTime = combineDateAndTime(newStart, startTimeStr);
    const EndTime = combineDateAndTime(newEnd, endTimeStr);

    const { error } = await supabase
      .from('reservations')
      .insert({
        user_id: userId,
        facility_id: selectedFacilityId, // FIX: Use the selected ID
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
      setDateRange({ from: undefined, to: undefined});
      router.refresh();
      window.location.reload(); 
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleReserve} className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-stretch justify-center">
        <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 justify-center items-center">
            
            {/* Left Column: Calendar */}
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
            
            {/* Right Column: Inputs */}
            <Card className="flex flex-col w-[300px] h-auto justify-center items-center bg-[#556378] pt-3 pb-3 rounded-lg text-[#556378]">
            <div className="flex flex-col justify-start w-[285px] mt-4 gap-2 px-4">  
            <Label className="px-1 text-white">Event Space</Label>
                <Select value={selectedFacilityId} onValueChange={setSelectedFacilityId}>
                    <SelectTrigger className="w-full bg-[#EEF4ED] border border-[#556378] cursor-pointer">
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
            </div>
            </Card>
        </div>
    </form>
  )
}