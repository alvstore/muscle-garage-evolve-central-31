
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AttendanceEntry } from '@/types/class';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MemberWithBranch } from '@/types/user';
import { Search, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendancePage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [members, setMembers] = useState<MemberWithBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data for members
  useEffect(() => {
    setTimeout(() => {
      setMembers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'member',
          membershipStatus: 'active',
          primaryBranchId: 'branch-1',
          accessibleBranchIds: ['branch-1'],
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'member',
          membershipStatus: 'active',
          primaryBranchId: 'branch-1',
          accessibleBranchIds: ['branch-1'],
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          role: 'member',
          membershipStatus: 'inactive',
          primaryBranchId: 'branch-1',
          accessibleBranchIds: ['branch-1'],
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // Mock data for attendance
  const attendanceData: AttendanceEntry[] = [
    {
      id: '1',
      memberId: '1',
      memberName: 'John Doe',
      time: '2025-04-21T08:15:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Front Desk',
      status: 'on-time'
    },
    {
      id: '2',
      memberId: '2',
      memberName: 'Jane Smith',
      time: '2025-04-21T09:30:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Mobile App',
      status: 'on-time'
    },
    {
      id: '3',
      memberId: '3',
      memberName: 'Mike Johnson',
      time: '2025-04-21T10:45:00Z',
      type: 'check-in',
      location: 'Back Entrance',
      device: 'Access Card',
      status: 'late'
    },
    {
      id: '4',
      memberId: '1',
      memberName: 'John Doe',
      time: '2025-04-20T08:15:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Front Desk',
      status: 'on-time'
    },
    {
      id: '5',
      memberId: '2',
      memberName: 'Jane Smith',
      time: '2025-04-20T09:30:00Z',
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Mobile App',
      status: 'on-time'
    }
  ];

  // Filter attendance data based on selected filter and member
  const filteredData = attendanceData
    .filter(entry => filter === 'all' || entry.type === filter)
    .filter(entry => selectedMember === 'all' || entry.memberId === selectedMember)
    .filter(entry => {
      if (!searchTerm) return true;
      return entry.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
             entry.device.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const handleViewMemberAttendance = (memberId: string) => {
    navigate(`/members/attendance/${memberId}`);
  };

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Attendance</h1>
          <Button onClick={() => navigate('/members/new')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Filter</CardTitle>
            <CardDescription>Select a date, member and filter options to view attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  id="date"
                  date={date}
                  onSelect={setDate}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="member">Member</Label>
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger id="member">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    {members.map(member => (
                      <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter">Entry Type</Label>
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
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-3 text-left font-medium">Member</th>
                      <th className="p-3 text-left font-medium">Time</th>
                      <th className="p-3 text-left font-medium">Type</th>
                      <th className="p-3 text-left font-medium">Location</th>
                      <th className="p-3 text-left font-medium">Device</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((entry) => (
                      <tr key={entry.id} className="border-b">
                        <td className="p-3">{entry.memberName}</td>
                        <td className="p-3">{new Date(entry.time).toLocaleString()}</td>
                        <td className="p-3 capitalize">{entry.type}</td>
                        <td className="p-3">{entry.location}</td>
                        <td className="p-3">{entry.device}</td>
                        <td className="p-3 capitalize">{entry.status}</td>
                        <td className="p-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewMemberAttendance(entry.memberId)}
                          >
                            View History
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default AttendancePage;
