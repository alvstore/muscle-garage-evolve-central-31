
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";

interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  method: "api" | "rfid" | "fingerprint" | "manual";
}

interface AttendanceTrackerProps {
  date?: Date;
}

const AttendanceTracker = ({ date = new Date() }: AttendanceTrackerProps) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const { user } = useAuth();
  const { can, userRole } = usePermissions();

  // Check if the user can manage attendance records
  const canManageAttendance = can("log_attendance");
  const isMember = userRole === "member";

  useEffect(() => {
    // Simulate fetching attendance records from API
    setLoading(true);
    
    setTimeout(() => {
      // Mock data
      const mockRecords: AttendanceRecord[] = [
        {
          id: "att-1",
          memberId: "member1", // This matches the member user ID in mock data
          memberName: "Member User",
          checkInTime: new Date(new Date().setHours(9, 15)).toISOString(),
          checkOutTime: new Date(new Date().setHours(11, 30)).toISOString(),
          method: "rfid"
        },
        {
          id: "att-2",
          memberId: "staff1",
          memberName: "Staff User",
          checkInTime: new Date(new Date().setHours(10, 0)).toISOString(),
          method: "fingerprint"
        },
        {
          id: "att-3",
          memberId: "trainer1",
          memberName: "Trainer User",
          checkInTime: new Date(new Date().setHours(8, 45)).toISOString(),
          checkOutTime: new Date(new Date().setHours(10, 15)).toISOString(),
          method: "api"
        }
      ];
      
      // If the user is a member, only show their records
      const filteredRecords = isMember && user
        ? mockRecords.filter(record => record.memberId === user.id)
        : mockRecords;
        
      setRecords(filteredRecords);
      setLoading(false);
    }, 1000);
  }, [date, user, isMember]);

  // Function to simulate receiving webhook from Hikvision
  const simulateHikvisionWebhook = () => {
    if (!user) return;
    
    const mockMemberId = user.id || "member-4";
    const mockMemberName = user.name || "Sarah Wilson";
    
    // In a real app, this would be a webhook handler
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: mockMemberId,
      memberName: mockMemberName,
      checkInTime: new Date().toISOString(),
      method: "api"
    };
    
    setRecords(prev => [...prev, newRecord]);
    toast.success(`${mockMemberName} checked in via Hikvision API`);
  };

  // Function to manually record attendance
  const recordManualAttendance = () => {
    if (!user) return;
    
    const mockMemberId = user.id || "member-5";
    const mockMemberName = user.name || "Alex Brown";
    
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: mockMemberId,
      memberName: mockMemberName,
      checkInTime: new Date().toISOString(),
      method: "manual"
    };
    
    setRecords(prev => [...prev, newRecord]);
    toast.success(`Manually recorded check-in for ${mockMemberName}`);
  };

  // Add a function to handle check-out
  const handleCheckOut = (recordId: string) => {
    setRecords(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, checkOutTime: new Date().toISOString() } 
          : record
      )
    );
    toast.success("Check-out recorded successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Tracker</CardTitle>
        <CardDescription>
          {isMember 
            ? "Monitor your check-ins and check-outs" 
            : "Monitor member check-ins and check-outs"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">
              {format(date, "EEEE, MMMM d, yyyy")}
            </h3>
            <p className="text-sm text-muted-foreground">
              Total check-ins today: {records.length}
            </p>
          </div>
          {canManageAttendance && (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={simulateHikvisionWebhook}
              >
                Simulate Hikvision API
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={recordManualAttendance}
              >
                Manual Check-in
              </Button>
            </div>
          )}
          {isMember && !canManageAttendance && (
            <Button 
              variant="default" 
              size="sm"
              onClick={recordManualAttendance}
            >
              Self Check-in
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="today" value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            {canManageAttendance && (
              <TabsTrigger value="denied">Access Denied</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="today">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 rounded-full border-4 border-t-accent animate-spin"></div>
              </div>
            ) : records.length > 0 ? (
              <div className="space-y-3">
                {records.map(record => (
                  <div key={record.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{record.memberName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Check-in: {format(new Date(record.checkInTime), "h:mm a")}</span>
                        {record.checkOutTime && (
                          <span>Check-out: {format(new Date(record.checkOutTime), "h:mm a")}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {record.method === "rfid" && "RFID Card"}
                        {record.method === "fingerprint" && "Fingerprint"}
                        {record.method === "api" && "Hikvision API"}
                        {record.method === "manual" && "Manual Entry"}
                      </Badge>
                      {!record.checkOutTime && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCheckOut(record.id)}
                        >
                          Record Check-out
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No attendance records for today
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-10 text-muted-foreground">
              Historical attendance records will be displayed here
            </div>
          </TabsContent>
          
          {canManageAttendance && (
            <TabsContent value="denied">
              <div className="text-center py-10 text-muted-foreground">
                Access denied events will be displayed here
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
