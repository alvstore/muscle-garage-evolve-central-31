
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CalendarCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberAttendanceCardProps {
  memberId: string;
}

interface AttendanceRecord {
  id: string;
  check_in: string;
  check_out: string | null;
  created_at: string;
  access_method: string;
}

const MemberAttendanceCard: React.FC<MemberAttendanceCardProps> = ({ memberId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (memberId) {
      fetchAttendanceRecords();
    }
  }, [memberId]);

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('member_attendance')
        .select('*')
        .eq('member_id', memberId)
        .order('check_in', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return "Still active";
    
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    const durationMs = checkOutTime - checkInTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getAccessMethodBadge = (method: string) => {
    switch (method) {
      case 'card':
        return <Badge variant="secondary">Card</Badge>;
      case 'biometric':
        return <Badge variant="secondary">Biometric</Badge>;
      case 'qr':
        return <Badge variant="secondary">QR Code</Badge>;
      case 'manual':
        return <Badge variant="outline">Manual</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          Attendance History
        </CardTitle>
        <CardDescription>Recent check-ins and check-outs</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : attendanceRecords.length > 0 ? (
          <div className="space-y-4">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="flex flex-col space-y-1 pb-3 border-b last:border-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(parseISO(record.check_in), "EEEE, MMM d, yyyy")}
                    </span>
                  </div>
                  {getAccessMethodBadge(record.access_method)}
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground pl-6">
                  <div>
                    <span className="font-medium">In:</span> {format(parseISO(record.check_in), "h:mm a")}
                    {record.check_out && (
                      <> • <span className="font-medium">Out:</span> {format(parseISO(record.check_out), "h:mm a")}</>
                    )}
                  </div>
                  <div>
                    {record.check_out ? getAttendanceDuration(record.check_in, record.check_out) : "Active"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No attendance records found for this member</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberAttendanceCard;
