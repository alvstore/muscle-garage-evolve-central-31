import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subHours } from 'date-fns';
import { Loader2, Search, RefreshCw, Filter, Download, Clock, Users, MapPin, Timer, Info } from 'lucide-react';
import { toast } from "sonner";
import { AttendanceEntry } from '@/types/attendance';

const RealTimeDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  
  useEffect(() => {
    // Fetch attendance data (mock for now)
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockAttendanceData: AttendanceEntry[] = [
          {
            memberId: "m1",
            memberName: "John Smith",
            time: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-in",
            location: "Main Branch",
            device: "East Entrance",
            status: "Valid"
          },
          {
            memberId: "m2",
            memberName: "Emily Johnson",
            time: format(subHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-in",
            location: "Main Branch",
            device: "West Entrance",
            status: "Valid"
          },
          {
            memberId: "m3",
            memberName: "Michael Brown",
            time: format(subHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-in",
            location: "Downtown Branch",
            device: "Main Entrance",
            status: "Valid"
          },
          {
            memberId: "m4",
            memberName: "Sarah Davis",
            time: format(subHours(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-out",
            location: "Main Branch",
            device: "East Entrance",
            status: "Valid"
          },
          {
            memberId: "m5",
            memberName: "Kevin Wilson",
            time: format(subHours(new Date(), 4), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-out",
            location: "Downtown Branch",
            device: "West Entrance",
            status: "Valid"
          },
          {
            memberId: "m6",
            memberName: "Laura Martinez",
            time: format(subHours(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-in",
            location: "West Side Location",
            device: "Main Entrance",
            status: "Valid"
          },
          {
            memberId: "m7",
            memberName: "Daniel Garcia",
            time: format(subHours(new Date(), 6), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-out",
            location: "West Side Location",
            device: "East Entrance",
            status: "Valid"
          },
          {
            memberId: "m8",
            memberName: "Jessica Rodriguez",
            time: format(subHours(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-in",
            location: "Main Branch",
            device: "West Entrance",
            status: "Valid"
          },
          {
            memberId: "m9",
            memberName: "Christopher Lee",
            time: format(subHours(new Date(), 8), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-out",
            location: "Downtown Branch",
            device: "Main Entrance",
            status: "Valid"
          },
          {
            memberId: "m10",
            memberName: "Ashley Perez",
            time: format(subHours(new Date(), 9), "yyyy-MM-dd'T'HH:mm:ss"),
            type: "check-in",
            location: "West Side Location",
            device: "East Entrance",
            status: "Valid"
          }
        ];
        
        setAttendanceData(mockAttendanceData);
        setFilteredData(mockAttendanceData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        toast.error("Failed to fetch attendance data");
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time updates (simulated)
    const interval = setInterval(() => {
      // Add a random new check-in occasionally
      if (Math.random() > 0.7) {
        const newEntry: AttendanceEntry = {
          memberId: `m${Math.floor(Math.random() * 100)}`,
          memberName: ["John Smith", "Emily Johnson", "Michael Brown", "Sarah Davis", "Kevin Wilson"][Math.floor(Math.random() * 5)],
          time: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          type: Math.random() > 0.5 ? "check-in" : "check-out",
          location: ["Main Branch", "Downtown Branch", "West Side Location"][Math.floor(Math.random() * 3)],
          device: ["Main Entrance", "East Entrance", "West Entrance"][Math.floor(Math.random() * 3)],
          status: Math.random() > 0.9 ? "Invalid" : "Valid"
        };
        
        setAttendanceData(prev => [newEntry, ...prev]);
        
        // Apply current filters to the new data
        if (
          (filterType === "all" || filterType === newEntry.type) &&
          (newEntry.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           newEntry.memberId.toLowerCase().includes(searchTerm.toLowerCase()))
        ) {
          setFilteredData(prev => [newEntry, ...prev]);
          if (newEntry.status === "Invalid") {
            toast.error(`Invalid check-in: ${newEntry.memberName}`);
          }
        }
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [searchTerm, filterType]);
  
  // Filter data based on search term and type
  useEffect(() => {
    const filtered = attendanceData.filter(entry => {
      const matchesSearch = entry.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             entry.memberId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || entry.type === filterType;
      return matchesSearch && matchesType;
    });
    setFilteredData(filtered);
  }, [searchTerm, filterType, attendanceData]);
  
  // Prepare chart data
  const chartData = filteredData.reduce((acc: any, entry) => {
    const hour = format(new Date(entry.time), "HH");
    const existingHour = acc.find((item: any) => item.hour === hour);
    
    if (existingHour) {
      existingHour[entry.type] = (existingHour[entry.type] || 0) + 1;
    } else {
      acc.push({ hour, [entry.type]: 1 });
    }
    
    return acc;
  }, []);
  
  // Sort chart data by hour
  chartData.sort((a: any, b: any) => parseInt(a.hour) - parseInt(b.hour));
  
  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Attendance data refreshed");
    }, 1000);
  };
  
  const handleDownloadData = () => {
    toast.info("Downloading attendance data...");
  };
  
  return (
    <Container>
      <div className="py-6 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Real-Time Attendance Dashboard</CardTitle>
              <Badge variant="secondary" className="space-x-1">
                <Clock className="h-4 w-4" />
                <span>Live Updates</span>
              </Badge>
            </div>
            <CardDescription>
              Monitor gym attendance in real-time with live updates and detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Total Check-ins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{filteredData.filter(entry => entry.type === "check-in").length}</div>
                  <div className="text-sm text-muted-foreground">
                    <Users className="h-4 w-4 inline-block mr-1" />
                    <span>Today's Visitors</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Current Occupancy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{filteredData.filter(entry => entry.type === "check-in").length - filteredData.filter(entry => entry.type === "check-out").length}</div>
                  <div className="text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 inline-block mr-1" />
                    <span>Active Members</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Average Visit Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">35 mins</div>
                  <div className="text-sm text-muted-foreground">
                    <Timer className="h-4 w-4 inline-block mr-1" />
                    <span>Typical Workout</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search member..."
                  className="max-w-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="check-in">Check-in</SelectItem>
                    <SelectItem value="check-out">Check-out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleRefreshData} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDownloadData}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Data
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="analytics" className="space-y-4">
              <TabsList>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="realtime">Real-Time Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Attendance</CardTitle>
                    <CardDescription>Visual representation of hourly check-ins and check-outs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="check-in" fill="#82ca9d" name="Check-ins" />
                        <Bar dataKey="check-out" fill="#8884d8" name="Check-outs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="realtime" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : filteredData.length > 0 ? (
                        filteredData.map(entry => (
                          <TableRow key={entry.memberId + entry.time}>
                            <TableCell className="font-medium">{entry.memberName} ({entry.memberId})</TableCell>
                            <TableCell>{format(new Date(entry.time), "hh:mm:ss a")}</TableCell>
                            <TableCell>{entry.type}</TableCell>
                            <TableCell>{entry.location}</TableCell>
                            <TableCell>{entry.device}</TableCell>
                            <TableCell>
                              {entry.status === "Invalid" ? (
                                <Badge variant="destructive">
                                  <Info className="h-4 w-4 mr-1" />
                                  Invalid
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Valid</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No attendance data found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default RealTimeDashboardPage;
