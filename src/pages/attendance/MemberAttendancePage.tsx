
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { AttendanceEntry } from '@/types/class';
import { Calendar, Clock, MapPin, Search, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

const MemberAttendancePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock attendance data
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([
    {
      id: '1',
      memberId: id || user?.id || '1',
      memberName: 'John Doe',
      time: '2025-04-01T08:15:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Front Desk',
      status: 'on-time'
    },
    {
      id: '2',
      memberId: id || user?.id || '1',
      memberName: 'John Doe',
      time: '2025-04-02T09:30:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Mobile App',
      status: 'on-time'
    },
    {
      id: '3',
      memberId: id || user?.id || '1',
      memberName: 'John Doe',
      time: '2025-04-03T10:45:00Z',
      type: 'check-in',
      location: 'Back Entrance',
      device: 'Access Card',
      status: 'late'
    },
    {
      id: '4',
      memberId: id || user?.id || '1',
      memberName: 'John Doe',
      time: '2025-04-04T11:30:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Front Desk',
      status: 'on-time'
    },
    {
      id: '5',
      memberId: id || user?.id || '1',
      memberName: 'John Doe',
      time: '2025-04-05T12:15:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Access Card',
      status: 'on-time'
    },
  ]);

  useEffect(() => {
    // Simulate API call to fetch member data and attendance
    setLoading(true);
    setTimeout(() => {
      setMember({
        id: id || user?.id,
        name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        membershipStatus: 'active',
      });
      setLoading(false);
    }, 800);
  }, [id, user]);

  // Filter attendance data based on selected filter and search term
  const filteredData = attendanceData
    .filter(entry => filter === 'all' || entry.type === filter)
    .filter(entry => 
      entry.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.device.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <Badge className="bg-green-500">On Time</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">Late</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatAttendanceTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString();
  };

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Attendance History</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        
        {member && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> 
                {member.name}
              </CardTitle>
              <CardDescription>{member.email}</CardDescription>
            </CardHeader>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Filter</CardTitle>
            <CardDescription>Select a date and filter options to view attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  id="date"
                  date={date}
                  onSelect={setDate}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter">Filter</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger id="filter">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="check-in">Check-ins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Log</CardTitle>
            <CardDescription>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="space-y-4">
                {filteredData.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{formatAttendanceTime(entry.time)}</h3>
                          <p className="text-sm text-muted-foreground">{entry.type}</p>
                        </div>
                      </div>
                      {getStatusBadge(entry.status)}
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.device}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No attendance records found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default MemberAttendancePage;
