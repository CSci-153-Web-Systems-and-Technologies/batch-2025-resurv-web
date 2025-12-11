"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Check, X, User, Calendar as CalendarIcon, Users, FileText, Clock, Inbox } from "lucide-react" 
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ReservationFormProps {
  facilities: {
    id: string;
    title: string;
  }[];
  userId: string;
}

export function ReservationCard({ facilities, userId }: ReservationFormProps) {
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
  
  const [viewReservation, setViewReservation] = React.useState<any>(null);
  const [pendingReservations, setPendingReservations] = React.useState<any[]>([]);

  const fetchPendingRequests = React.useCallback(async () => {
    const supabaseClient = await getSupabase();
    if (!supabaseClient) return;

    const { data, error } = await supabaseClient
        .from('reservations')
        .select(`
            id, 
            start_time, 
            end_time, 
            facility_id, 
            purpose,
            num_attendees,
            special_req,
            status,
            profiles (full_name, email, student_id)
        `)
        .eq('status', 'pending')
        .order('start_time', { ascending: true });

    if (!error && data) {
        setPendingReservations(data);
    }
  }, []); 

  React.useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);


  const relevantPending = React.useMemo(() => {
    return pendingReservations.filter(r => r.facility_id === selectedFacilityId);
  }, [pendingReservations, selectedFacilityId]);

  const handleReview = async (reservationId: string, newStatus: 'approved' | 'rejected') => {
    const confirmMsg = newStatus === 'approved' ? "Approve this reservation?" : "Reject this reservation?";
    if (!confirm(confirmMsg)) return;

    try {
        const supabaseClient = await getSupabase();
        if (!supabaseClient) {
            alert("Authentication failed. Please reload.");
            return;
        }

        const { data, error } = await supabaseClient
            .from('reservations')
            .update({ status: newStatus })
            .eq('id', reservationId)
            .select(); 

        if (error) throw error;

        if (!data || data.length === 0) {
            alert("Error: Database permission denied. You might not be an 'admin' in the database.");
            return;
        }

        alert(`Reservation ${newStatus} successfully!`);
        setViewReservation(null);
        fetchPendingRequests(); 

    } catch (error: any) {
        console.error(error);
        alert("Error updating status: " + error.message);
    }
  };

  React.useEffect(() => {
    const fetchBookings = async () => {
        if (!selectedFacilityId) return;
        
        const supabaseClient = await getSupabase();
        if(!supabaseClient) return;

        const { data } = await supabaseClient
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
    const startTimeStr = formData.get("start_time") as string;
    const endTimeStr = formData.get("end_time") as string;
    const purpose = formData.get("purpose") as string;
    const attendees = formData.get("attendees") as string;
    const requirements = formData.get("requirements") as string;

    const StartTime = combineDateAndTime(newStart, startTimeStr);
    const EndTime = combineDateAndTime(newEnd, endTimeStr);

    const supabaseClient = await getSupabase();
    if (!supabaseClient) { setIsSubmitting(false); return; }

    const { error } = await supabaseClient.from('reservations').insert({
        user_id: userId,
        facility_id: selectedFacilityId,
        start_time: StartTime,
        end_time: EndTime,
        purpose, num_attendees: attendees, special_req: requirements,
        status: 'pending', 
    });

    if (!error) {
      alert("Success!");
      form.reset();
      setDateRange(undefined);
      fetchPendingRequests(); 
    } else {
        alert(error.message);
    }
    setIsSubmitting(false);
  }

  return (
    <>
    <Dialog open={!!viewReservation} onOpenChange={(open) => !open && setViewReservation(null)}>
      <DialogContent className="sm:max-w-[500px] bg-[#EEF4ED] text-[#556378] border-[#556378]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Review Reservation
          </DialogTitle>
          <DialogDescription>
             Review the details below before approving or rejecting.
          </DialogDescription>
        </DialogHeader>

        {viewReservation && (
            <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-[#556378]">
                    <h3 className="font-semibold flex items-center gap-2 text-sm text-gray-500 uppercase">
                        <User className="h-4 w-4" /> Requestor
                    </h3>
                    <div className="pl-6">
                        <p className="font-bold text-lg">{viewReservation.profiles?.full_name || "Unknown User"}</p>
                        <p className="text-sm text-gray-600">{viewReservation.profiles?.email}</p>
                        {viewReservation.profiles?.student_id && (
                            <p className="text-sm text-gray-500">ID: {viewReservation.profiles.student_id}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-[#556378]">
                    <h3 className="font-semibold flex items-center gap-2 text-sm text-gray-500 uppercase">
                        <CalendarIcon className="h-4 w-4" /> Event Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pl-6">
                        <div>
                            <span className="text-xs text-gray-400 font-bold block">DATE</span>
                            <span className="font-medium">{new Date(viewReservation.start_time).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-bold block">TIME</span>
                            <span className="font-medium">
                                {new Date(viewReservation.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(viewReservation.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                    <div className="pl-6 mt-2">
                         <span className="text-xs text-gray-400 font-bold block">PURPOSE</span>
                         <p className="text-sm">{viewReservation.purpose}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                     <div className="flex-1 p-3 bg-white rounded-lg border border-[#556378]">
                         <h3 className="font-semibold flex items-center gap-2 text-sm text-gray-500 uppercase mb-1">
                            <Users className="h-4 w-4" /> Attendees
                         </h3>
                         <p className="pl-6 font-medium">{viewReservation.num_attendees || "N/A"}</p>
                     </div>
                     {viewReservation.special_req && (
                         <div className="flex-1 p-3 bg-white rounded-lg border border-[#556378]">
                            <h3 className="font-semibold flex items-center gap-2 text-sm text-gray-500 uppercase mb-1">
                                <Check className="h-4 w-4" /> Requirements
                            </h3>
                            <p className="pl-6 text-sm">{viewReservation.special_req}</p>
                         </div>
                     )}
                </div>
            </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
            onClick={() => handleReview(viewReservation.id, 'rejected')}
          >
            <X className="h-4 w-4 mr-2" /> Reject
          </Button>
          <Button 
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => handleReview(viewReservation.id, 'approved')}
          >
            <Check className="h-4 w-4 mr-2" /> Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Card className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-stretch justify-center">
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

                        {/* --- ALWAYS VISIBLE PENDING REQUESTS CARD --- */}
                        <div className="mt-2 p-2 bg-[#EEF4ED] rounded-md border border-yellow-200 h-full h-full overflow-y-auto ">
                            <p className="text-lg font-bold text-yellow-800 mb-2 sticky top-0 bg-[#EEF4ED] flex justify-between items-center">
                                <span>⚠️ PENDING</span>
                                <Badge variant="outline" className="text-yellow-800 border-yellow-800 bg-yellow-100">
                                    {relevantPending.length}
                                </Badge>
                            </p>
                            
                            {/* Empty State Check */}
                            {relevantPending.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-28 text-gray-400 italic gap-2">
                                    <Inbox className="h-8 w-8 opacity-50" />
                                    <p className="text-xs">No pending requests</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {relevantPending.map((r) => (
                                        <div 
                                            key={r.id} 
                                            onClick={() => setViewReservation(r)} 
                                            className="text-xs bg-white p-3 rounded border border-yellow-100 shadow-sm flex flex-col gap-1 cursor-pointer hover:bg-yellow-50 hover:border-yellow-300 transition-all group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-bold text-[#556378] text-sm group-hover:text-black">
                                                        {new Date(r.start_time).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-gray-500 font-medium">
                                                        {r.profiles?.full_name || "Unknown User"}
                                                    </div>
                                                </div>
                                                <div className="bg-[#556378]/10 p-1 rounded">
                                                    <Clock className="h-3 w-3 text-[#556378]" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <div className="italic text-gray-400 truncate max-w-[150px]">
                                                    "{r.purpose}"
                                                </div>
                                                <span className="text-[10px] text-blue-500 font-bold hover:underline">Review</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </Card>
    </>
  )
}