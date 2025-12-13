"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Check, X, User, Calendar as CalendarIcon, Users, FileText, Clock, Inbox, ShieldCheck, Trash2 } from "lucide-react" 
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  const [selectedFacilityId, setSelectedFacilityId] = React.useState<string>("");
  const [bookedDates, setBookedDates] = React.useState<{ from: Date; to: Date }[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({ from: undefined, to: undefined })
  
  const [viewReservation, setViewReservation] = React.useState<any>(null);
  
  const [pendingReservations, setPendingReservations] = React.useState<any[]>([]);
  const [approvedReservations, setApprovedReservations] = React.useState<any[]>([]);

  const fetchReservations = React.useCallback(async () => {
    const supabaseClient = await getSupabase();
    if (!supabaseClient) return;

    const { data, error } = await supabaseClient
        .from('reservations')
        .select(`
            id, start_time, end_time, facility_id, purpose,
            num_attendees, special_req, status,
            profiles (full_name, email, student_id)
        `)
        .in('status', ['pending', 'approved', 'Approved']) 
        .order('start_time', { ascending: true });

    if (!error && data) {
        setPendingReservations(data.filter(r => r.status === 'pending'));
        setApprovedReservations(data.filter(r => r.status.toLowerCase() === 'approved'));
    }
  }, []); 

  React.useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const relevantPending = React.useMemo(() => {
    return pendingReservations.filter(r => r.facility_id === selectedFacilityId);
  }, [pendingReservations, selectedFacilityId]);

  const relevantApproved = React.useMemo(() => {
    return approvedReservations.filter(r => r.facility_id === selectedFacilityId);
  }, [approvedReservations, selectedFacilityId]);


  const handleReview = async (reservationId: string, newStatus: 'approved' | 'rejected') => {
    const confirmMsg = newStatus === 'approved' ? "Approve this reservation?" : "Reject this reservation?";
    if (!confirm(confirmMsg)) return;

    try {
        const supabaseClient = await getSupabase();
        if (!supabaseClient) return;

        const { data, error } = await supabaseClient
            .from('reservations')
            .update({ status: newStatus })
            .eq('id', reservationId)
            .select(); 

        if (error) throw error;
        if (!data || data.length === 0) {
            alert("Error: Permission denied."); return;
        }

        alert(`Reservation ${newStatus} successfully!`);
        setViewReservation(null);
        fetchReservations(); 

    } catch (error: any) {
        console.error(error);
        alert("Error: " + error.message);
    }
  };

  const handleDelete = async (reservationId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation? This cannot be undone.")) return;

    try {
        const supabaseClient = await getSupabase();
        if (!supabaseClient) return;

        const { data, error } = await supabaseClient
            .from('reservations')
            .delete()
            .eq('id', reservationId)
            .select(); 

        if (error) throw error;

        if (!data || data.length === 0) {
            alert("Error: Permission denied. You might not be an 'admin' in the database.");
            return;
        }

        alert("Reservation cancelled successfully.");
        setViewReservation(null); 
        fetchReservations(); 

    } catch (error: any) {
        console.error(error);
        alert("Error: " + error.message);
    }
  };

  // --- CALENDAR ---
  
  React.useEffect(() => {
    const fetchBookings = async () => {
        const supabaseClient = await getSupabase();
        if(!supabaseClient) return;

        let query = supabaseClient
            .from('reservations')
            .select('start_time, end_time, status')
            .in('status', ['approved', 'pending', 'Approved']);

        if (selectedFacilityId) {
            query = query.eq('facility_id', selectedFacilityId);
        }

        const { data } = await query;

        if (data) {
            const formatted = data.map(b => ({
                from: new Date(b.start_time),
                to: new Date(b.end_time)
            }));
            setBookedDates(formatted);
        }
    };
    fetchBookings();
  }, [selectedFacilityId, pendingReservations, approvedReservations]); 

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
        alert("Please select an Event Space first.");
        setIsSubmitting(false);
        return;
    }
    if (!dateRange?.from) { alert("Please select a date on the calendar."); setIsSubmitting(false); return; }

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
      fetchReservations(); 
    } else {
        alert(error.message);
    }
    setIsSubmitting(false);
  }

  return (
    <>
    {/* --- NEW UPDATED MODAL DESIGN --- */}
    <Dialog open={!!viewReservation} onOpenChange={(open) => !open && setViewReservation(null)}>
      <DialogContent className="sm:max-w-[500px] bg-[#EEF4ED] text-[#556378] border border-[#556378]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {viewReservation?.status === 'pending' ? 'Review Reservation' : 'Reservation Details'}
          </DialogTitle>
          <DialogDescription>
             {viewReservation?.status === 'pending' 
                ? "Review the details below before approving or rejecting." 
                : "Details of this approved event."}
          </DialogDescription>
        </DialogHeader>

        {viewReservation && (
            <div className="grid gap-4 py-4">
                
                {/* 1. Requestor Card */}
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

                {/* 2. Event Details Card */}
                <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-[#556378]">
                    <h3 className="font-semibold flex items-center gap-2 text-sm text-gray-500 uppercase ">
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

                {/* 3. Attendees & Requirements Flex Row */}
                <div className="flex gap-4">
                      <div className="flex-1 p-3 bg-white rounded-lg border border-[#556378]">
                          <h3 className="font-semibold flex items-center gap-2 text-sm text-gray-500 uppercase  mb-1">
                             <Users className="h-4 w-4" /> Attendees
                          </h3>
                          <p className="pl-6 font-medium">{viewReservation.num_attendees || "N/A"}</p>
                      </div>
                      {viewReservation.special_req && (
                          <div className="flex-1 p-3 bg-white rounded-lg border border-[#556378]">
                             <h3 className="font-semibold flex items-center gap-2 text-sm text-gray-500 uppercase  mb-1">
                                 <Check className="h-4 w-4" /> Requirements
                             </h3>
                             <p className="pl-6 text-sm">{viewReservation.special_req}</p>
                          </div>
                      )}
                </div>
            </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {viewReservation?.status === 'pending' ? (
            <>
                <Button 
                    variant="outline" 
                    className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                    onClick={() => handleReview(viewReservation.id, 'rejected')}
                >
                    <X className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button className="bg-green-600 text-white hover:bg-green-700 ml-1" 
                onClick={() => handleReview(viewReservation.id, 'approved')}>
                <Check className="h-4 w-4 mr-2" /> Approve
                </Button>
            </>
          ) : (
            <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
                onClick={() => handleDelete(viewReservation.id)}
            >
                <Trash2 className="h-4 w-4 mr-2" /> Cancel Reservation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Card className="flex flex-col w-full max-w-5xl mx-auto mt-2 bg-[#dce5f2] border border-slate-400 rounded-xl shadow-sm overflow-hidden items-stretch justify-center">
        <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 justify-center items-start">
            
            {/* LEFT: CALENDAR */}
            <Card className="flex flex-col w-full md:flex-1 h-auto bg-[#556378] rounded-lg shadow-sm p-4 text-white justify-center items-center">
                <Calendar
                    mode="range"
                    defaultMonth={new Date()}
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={normalizedBookedDates}
                    modifiers={{ booked: normalizedBookedDates }}
                    modifiersClassNames={{ booked: "bg-red-200 text-red-600 line-through opacity-50" }}
                    className="rounded-lg border bg-[#EEF4ED] text-[#556378] p-3 w-auto md:w-full [&_td]:pointer-events-none"
                />
            </Card>
            
            {/* RIGHT: LISTS & FORM */}
            <div className="flex flex-col gap-3 h-full w-[300px]">
                <Card className="flex flex-col h-full bg-[#556378] p-4 rounded-lg text-[#556378]">
                    <Select value={selectedFacilityId} onValueChange={setSelectedFacilityId}>
                        <SelectTrigger className=" font-bold w-full bg-[#EEF4ED] border border-[#556378]">
                            <SelectValue placeholder="Select an Event Space"/>
                        </SelectTrigger>
                        <SelectContent className="bg-[#EEF4ED]">
                            <SelectGroup>
                                {facilities.map((space) => (
                                    <SelectItem key={space.id} value={space.id}>{space.title}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* --- TABS --- */}
                    <Tabs defaultValue="pending" className="w-full mt-2 flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 bg-[#445166]">
                            <TabsTrigger value="pending" className="data-[state=active]:bg-[#EEF4ED] text-white data-[state=active]:text-[#556378]">Pending</TabsTrigger>
                            <TabsTrigger value="approved" className="data-[state=active]:bg-[#EEF4ED] text-white data-[state=active]:text-[#556378]">Approved</TabsTrigger>
                        </TabsList>
                        
                        {/* PENDING CONTENT */}
                        <TabsContent value="pending" className="flex-1 mt-2 bg-[#EEF4ED] rounded-md border border-yellow-200 p-2 overflow-y-auto h-full">
                            {relevantPending.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-20 text-gray-400 italic gap-2">
                                    <Inbox className="h-6 w-6 opacity-50" />
                                    <p className="text-xs">No pending requests</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {relevantPending.map((r) => (
                                        <div 
                                            key={r.id} 
                                            onClick={() => setViewReservation(r)} 
                                            className="text-xs bg-white p-2 rounded border border-yellow-100 shadow-sm cursor-pointer hover:bg-yellow-50 transition-colors"
                                        >
                                            <div className="flex justify-between font-bold text-[#556378]">
                                                <span>{new Date(r.start_time).toLocaleDateString()}</span>
                                                <Badge variant="outline" className="text-[10px] h-4 border-yellow-500 text-yellow-600">Review</Badge>
                                            </div>
                                            <div className="text-gray-500 truncate">{r.profiles?.full_name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* APPROVED CONTENT */}
                        <TabsContent value="approved" className="flex-1 mt-2 bg-[#EEF4ED] rounded-md border border-green-200 p-2 overflow-y-auto ">
                            {relevantApproved.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-20 text-gray-400 italic gap-2">
                                    <ShieldCheck className="h-6 w-6 opacity-50" />
                                    <p className="text-xs">No approved bookings</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {relevantApproved.map((r) => (
                                        <div 
                                            key={r.id} 
                                            onClick={() => setViewReservation(r)} 
                                            className="text-xs bg-white p-2 rounded border border-green-100 shadow-sm cursor-pointer hover:bg-green-50 transition-colors"
                                        >
                                            <div className="flex justify-between font-bold text-[#556378]">
                                                <span>{new Date(r.start_time).toLocaleDateString()}</span>
                                                <Badge variant="outline" className="text-[10px] h-4 border-green-500 text-green-600">Active</Badge>
                                            </div>
                                            <div className="text-gray-500 truncate max-w-[150px]">
                                                {r.profiles?.full_name || "Admin Block"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                    
                </Card>
            </div>
        </div>
    </Card>
    </>
  )
}