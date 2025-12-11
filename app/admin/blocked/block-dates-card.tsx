"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js"; 
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
}

export function AdminBlockCard({ facilities, userId }: ReservationFormProps) {
  const { getToken } = useAuth();
  const router = useRouter();

  const getSupabase = async () => {
    const token = await getToken({ template: 'supabase' });
    if (!token) return null;
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = React.useState<string>(facilities[0]?.id || "");
  const [bookedDates, setBookedDates] = React.useState<{ from: Date; to: Date }[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({ from: undefined, to: undefined })

  const fetchBookings = React.useCallback(async () => {
    if (!selectedFacilityId) return;
    
    const supabaseClient = await getSupabase();
    if(!supabaseClient) return;

    const { data } = await supabaseClient
        .from('reservations')
        .select('start_time, end_time')
        .eq('facility_id', selectedFacilityId)
        .in('status', ['approved', 'pending']); 

    if (data) {
        const formatted = data.map(b => ({
            from: new Date(b.start_time),
            to: new Date(b.end_time)
        }));
        setBookedDates(formatted);
    }
  }, [selectedFacilityId]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); 

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

  async function handleBlockDate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget as HTMLFormElement;

    if (!dateRange?.from) { 
        alert("Please select a date on the calendar."); 
        setIsSubmitting(false); 
        return; 
    }

    const newStart = dateRange.from;
    const newEnd = dateRange.to || dateRange.from;
    
    const hasConflict = normalizedBookedDates.some((booking) => {
        return newStart < booking.to && newEnd > booking.from;
    });

    if (hasConflict) {
        alert("Conflict detected! This date is already booked.");
        setIsSubmitting(false);
        return; 
    }

    const formData = new FormData(form);
    const startTimeStr = formData.get("start_time") as string;
    const endTimeStr = formData.get("end_time") as string;
    const purpose = formData.get("purpose") as string;

    const StartTime = combineDateAndTime(newStart, startTimeStr);
    const EndTime = combineDateAndTime(newEnd, endTimeStr);

    const supabaseClient = await getSupabase();
    if (!supabaseClient) { setIsSubmitting(false); return; }

    const { error } = await supabaseClient.from('reservations').insert({
        user_id: userId,
        facility_id: selectedFacilityId,
        start_time: StartTime,
        end_time: EndTime,
        purpose: purpose, 
        num_attendees: 0, 
        special_req: "Admin Block / Maintenance",
        status: 'approved', 
    });

    if (!error) {
      alert("Date blocked successfully!");
      form.reset();
      setDateRange(undefined);
      fetchBookings(); 
      router.refresh();
    } else {
        console.error(error);
        alert("Error blocking date: " + error.message);
    }
    setIsSubmitting(false);
  }

  return (
    <Card className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-stretch justify-center">
        <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 justify-center items-start">
            
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
            
            <div className="flex flex-col gap-3 h-full justify-center">
                <Card className="flex flex-col w-[300px] justify-center items-center bg-[#556378] pt-3 pb-3 rounded-lg text-[#556378] h-auto">
                    <div className="flex flex-col justify-center w-[285px] h-auto m-2 gap-2 px-4">
                        
                        <Label className="px-1 text-white text-lg">Block Event Space</Label>
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
                        
                        <form onSubmit={handleBlockDate} className="mt-2 flex flex-col gap-2"> 
                            <Label htmlFor="start_time" className="px-1 text-white text-xs mt-2">Start Time</Label>
                            <Input name="start_time" type="time" required defaultValue="08:00" className="px-1 text-[#EEF4ED] [&::-webkit-calendar-picker-indicator]:hidden" />
                            
                            <Label htmlFor="end_time" className="px-1 text-white text-xs">End Time</Label>
                            <Input name="end_time" type="time" required defaultValue="17:00" className="px-1 text-[#EEF4ED] [&::-webkit-calendar-picker-indicator]:hidden" /> 

                            <Label htmlFor="purpose" className="text-white px-1 text-xs mt-1">Reason for Blocking</Label>
                            <Textarea 
                                name="purpose" 
                                required 
                                placeholder="e.g. Maintenance, School Holiday" 
                                className="w-full max-w-[300px] text-[#EEF4ED] h-20" 
                            />
                            
                            <Button type="submit" disabled={isSubmitting} className="mt-4 bg-red-500 text-white hover:bg-red-600 cursor-pointer w-full">
                                {isSubmitting ? "Blocking..." : "Confirm Block"}
                            </Button>
                        </form>

                    </div>
                </Card>
            </div>
        </div>
    </Card>
  )
}