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
import { formatDateRange } from "little-date" // Ensure you have this or use custom formatter

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReservationFormProps {
  facilities: {
    id: string;
    title: string;
  }[];
  userId: string;
  // 1. New Prop Definition
  pendingReservations: any[]; 
}

export function ReservationCard({ facilities, userId, pendingReservations }: ReservationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = React.useState<string>(facilities[0]?.id || "");
  const [bookedDates, setBookedDates] = React.useState<{ from: Date; to: Date }[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({ from: undefined, to: undefined })

  // 2. Filter Pending Requests for the SELECTED Facility
  const relevantPending = React.useMemo(() => {
    return pendingReservations.filter(r => r.facility_id === selectedFacilityId);
  }, [pendingReservations, selectedFacilityId]);

  React.useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedFacilityId) return;
      
      const { data, error } = await supabase
        .from('reservations')
        .select('start_time, end_time, status')
        .eq('facility_id', selectedFacilityId)
        .in('status', ['approved', 'pending']); 

      if (data) {
        const formatted = data.map(b => ({
            from: new Date(b.start_time),
            to: new Date(b.end_time)
        }));
        setBookedDates(formatted);
      }
    };
    fetchBookings();
  }, [selectedFacilityId]); 

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

    if (!dateRange?.from) { alert("Please select a date."); setIsSubmitting(false); return; }

    const newStart = dateRange.from;
    const newEnd = dateRange.to || dateRange.from;
    
    // Check conflicts
    const hasConflict = normalizedBookedDates.some((booking) => {
        return newStart < booking.to && newEnd > booking.from;
    });

    if (hasConflict) {
        alert("Conflict detected!");
        setDateRange(undefined); 
        setIsSubmitting(false);
        return; 
    }

    const formData = new FormData(form);
    // ... extract form data ...
    // (kept short for brevity, keep your original extraction logic here)
    const startTimeStr = formData.get("start_time") as string;
    const endTimeStr = formData.get("end_time") as string;
    const purpose = formData.get("purpose") as string;
    const attendees = formData.get("attendees") as string;
    const requirements = formData.get("requirements") as string;

    const StartTime = combineDateAndTime(newStart, startTimeStr);
    const EndTime = combineDateAndTime(newEnd, endTimeStr);

    const { error } = await supabase.from('reservations').insert({
        user_id: userId,
        facility_id: selectedFacilityId,
        start_time: StartTime,
        end_time: EndTime,
        purpose, num_attendees: attendees, special_req: requirements,
        status: 'pending', // Admins usually "approve" immediately, but let's keep 'pending' or change to 'approved' if you prefer
    });

    if (!error) {
      alert("Success!");
      form.reset();
      setDateRange(undefined);
      router.refresh();
      window.location.reload(); 
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleReserve} className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-stretch justify-center">
        <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 justify-center items-start">
            
            {/* Left Column: Calendar */}
            <Card className="flex flex-col w-full md:flex-1 h-auto bg-[#556378] rounded-lg shadow-sm p-4 text-white justify-center items-center">
                <Calendar
                    mode="range"
                    defaultMonth={new Date()}
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={normalizedBookedDates}
                    modifiers={{ booked: normalizedBookedDates }}
                    modifiersClassNames={{ booked: "bg-red-200 text-red-600 line-through opacity-50" }}
                    className="rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-auto md:w-full"
                />
            </Card>
            
            {/* Right Column: Inputs & Pending List */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col w-[300px] h-full justify-center items-center bg-[#556378] pt-3 pb-3 rounded-lg text-[#556378]">
                    <div className="flex flex-col justify-start w-[285px] h-full m-2 gap-2 px-4">
                        
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

                        {relevantPending.length > 0 && (
                            <div className="mt-2 p-2 bg-[#EEF4ED] rounded-md border border-yellow-200 h-full overflow-y-auto">
                                <p className="text-xs font-bold text-yellow-800 mb-2 sticky top-0">
                                    ⚠️ Pending Requests ({relevantPending.length})
                                </p>
                                <div className="flex flex-col gap-2">
                                    {relevantPending.map((r) => (
                                        <div key={r.id} className="text-xs bg-white p-2 rounded border border-yellow-100 shadow-sm">
                                            <div className="font-semibold text-[#556378]">
                                                {new Date(r.start_time).toLocaleDateString()}
                                            </div>
                                            <div className="text-gray-500 truncate">
                                                {r.profiles?.full_name || "Unknown User"}
                                            </div>
                                            <div className="italic text-gray-400 truncate">
                                                "{r.purpose}"
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </Card>
            </div>
        </div>
    </form>
  )
}