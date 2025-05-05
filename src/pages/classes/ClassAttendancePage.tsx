
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Search, CheckCircle2, XCircle, UserCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ClassAttendancePage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState<any[]>([]);

  // Mock data
  const classData = {
    id: id,
    name: 'Advanced Yoga',
    date: 'Monday, May 5, 2025',
    time: '10:00 AM - 11:30 AM',
    trainer: 'Sarah Johnson',
    enrolled: 14,
  };

  const mockMembers = [
    { id: '1', name: 'John Smith', email: 'john@example.com', avatar: null, present: true },
    { id: '2', name: 'Emma Johnson', email: 'emma@example.com', avatar: null, present: true },
    { id: '3', name: 'Michael Brown', email: 'michael@example.com', avatar: null, present: false },
    { id: '4', name: 'Olivia Davis', email: 'olivia@example.com', avatar: null, present: true },
    { id: '5', name: 'James Wilson', email: 'james@example.com', avatar: null, present: false },
    { id: '6', name: 'Sophia Taylor', email: 'sophia@example.com', avatar: null, present: true },
    { id: '7', name: 'William Clark', email: 'william@example.com', avatar: null, present: true },
    { id: '8', name: 'Isabella Lee', email: 'isabella@example.com', avatar: null, present: false },
  ];

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setAttendees(mockMembers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAttendanceChange = (memberId: string, isPresent: boolean) => {
    setAttendees(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, present: isPresent } : member
      )
    );
  };

  const filteredAttendees = attendees.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = attendees.filter(member => member.present).length;

  if (isLoading) {
    return (
      <Container>
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Class Details
        </Button>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div>
                <CardTitle>{classData.name} - Attendance</CardTitle>
                <p className="text-sm text-muted-foreground">{classData.date} | {classData.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Present: {presentCount}/{attendees.length}</span>
                <Button variant="outline" size="sm">Save</Button>
                <Button size="sm">Mark All Present</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '50px' }}>No.</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Present</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendees.map((member, index) => (
                      <TableRow key={member.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            {member.name}
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <div className="flex gap-2 items-center">
                              <Button
                                variant={member.present ? "default" : "outline"}
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleAttendanceChange(member.id, true)}
                              >
                                <UserCheck className="h-4 w-4" />
                                Present
                              </Button>
                              <Button
                                variant={!member.present ? "destructive" : "outline"}
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleAttendanceChange(member.id, false)}
                              >
                                <XCircle className="h-4 w-4" />
                                Absent
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredAttendees.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No members found matching your search
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ClassAttendancePage;
