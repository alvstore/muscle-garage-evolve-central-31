
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, UserRound, Users, Bell, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AttendanceEntry } from '@/types';
import { useBranch } from '@/hooks/use-branch';
import { supabase, subscribeToTable } from '@/services/supabaseClient';

const RealTimeDashboardPage = () => {
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState('activity');
  const [branchFilter, setBranchFilter] = useState('all');
  
  // Recent activity entries
  const [activityEntries, setActivityEntries] = useState<AttendanceEntry[]>([
    {
      memberId: 'member-1',
      memberName: 'John Doe',
      time: new Date(Date.now() - 15 * 60000).toISOString(),
      type: 'check-in',
      location: 'Main Entrance',
      device: 'RFID Scanner 01',
      status: 'success'
    },
    {
      memberId: 'member-2',
      memberName: 'Jane Smith',
      time: new Date(Date.now() - 30 * 60000).toISOString(),
      type: 'check-out',
      location: 'Side Exit',
      device: 'RFID Scanner 02',
      status: 'success'
    },
    {
      memberId: 'member-3',
      memberName: 'Robert Johnson',
      time: new Date(Date.now() - 45 * 60000).toISOString(),
      type: 'check-in',
      location: 'Main Entrance',
      device: 'Manual Entry',
      status: 'success'
    }
  ]);
  
  // Alert data
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-1',
      type: 'attendance_failure',
      memberId: 'member-4',
      memberName: 'Alex Williams',
      time: new Date(Date.now() - 20 * 60000).toISOString(),
      message: 'Failed to check in: Card not recognized',
      status: 'unresolved'
    },
    {
      id: 'alert-2',
      type: 'payment_due',
      memberId: 'member-5',
      memberName: 'Sarah Johnson',
      time: new Date(Date.now() - 60 * 60000).toISOString(),
      message: 'Membership payment due in 2 days',
      status: 'unresolved'
    },
    {
      id: 'alert-3',
      type: 'membership_expired',
      memberId: 'member-6',
      memberName: 'Michael Brown',
      time: new Date(Date.now() - 3 * 3600000).toISOString(),
      message: 'Membership expired yesterday',
      status: 'unresolved'
    }
  ]);
  
  // Currently active members
  const [activeMembers, setActiveMembers] = useState([
    {
      id: 'member-1',
      name: 'John Doe',
      checkInTime: new Date(Date.now() - 75 * 60000).toISOString(),
      location: 'Weights Area',
      avatar: null,
      membershipStatus: 'active',
      paymentDue: false
    },
    {
      id: 'member-3',
      name: 'Robert Johnson',
      checkInTime: new Date(Date.now() - 45 * 60000).toISOString(),
      location: 'Cardio Area',
      avatar: null,
      membershipStatus: 'active',
      paymentDue: false
    },
    {
      id: 'member-7',
      name: 'Emily Davis',
      checkInTime: new Date(Date.now() - 30 * 60000).toISOString(),
      location: 'Yoga Studio',
      avatar: null,
      membershipStatus: 'active',
      paymentDue: true
    },
    {
      id: 'member-8',
      name: 'David Miller',
      checkInTime: new Date(Date.now() - 15 * 60000).toISOString(),
      location: 'Weights Area',
      avatar: null,
      membershipStatus: 'expiring',
      paymentDue: false
    }
  ]);
  
  // Mock function to resolve an alert
  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
  };
  
  // Format time function
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const hours = date.getHours();
    const mins = date.getMinutes();
    return `${hours}:${mins < 10 ? '0' + mins : mins}`;
  };
  
  // Function to get the initials from a name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Subscribe to real-time updates
  useEffect(() => {
    // This would use the Supabase real-time subscription in a real application
    console.log("Setting up real-time subscriptions");
    
    // Example of how to set up a Supabase subscription
    const subscription = subscribeToTable('attendance', (payload) => {
      console.log('New attendance record:', payload);
      // Handle new attendance entries here
    });
    
    return () => {
      // Clean up subscription
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Real-Time Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor live activity and alerts
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="main">Main Branch</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="uptown">Uptown</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="secondary" className="flex gap-1 items-center">
              <ArrowUpDown className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                Members currently in the facility
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">158</div>
              <p className="text-xs text-muted-foreground">
                Total check-ins today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.filter(a => a.status === 'unresolved').length}</div>
              <p className="text-xs text-muted-foreground">
                Unresolved issues requiring attention
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Active Members
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Real-time check-ins and check-outs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {activityEntries.map((entry, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <Avatar>
                        <AvatarImage src={`/avatars/${entry.memberId}.png`} alt={entry.memberName} />
                        <AvatarFallback>{getInitials(entry.memberName)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{entry.memberName}</h4>
                          <span className="text-xs text-muted-foreground">{formatTime(entry.time)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {entry.type === 'check-in' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Check-in
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Check-out
                            </Badge>
                          )}
                          <span className="ml-2">via {entry.device} at {entry.location}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Currently Active Members</CardTitle>
                <CardDescription>Members checked in right now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {activeMembers.map((member, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <Avatar>
                        <AvatarImage src={member.avatar || undefined} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{member.name}</h4>
                          <span className="text-xs text-muted-foreground">
                            Since {formatTime(member.checkInTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {member.location}
                          </p>
                          <div className="flex gap-1">
                            {member.membershipStatus === 'expiring' && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                Expiring soon
                              </Badge>
                            )}
                            {member.paymentDue && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Payment due
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Issues that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {alerts.filter(alert => alert.status === 'unresolved').map((alert, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className={`p-2 rounded-full ${
                        alert.type === 'attendance_failure' ? 'bg-red-100 text-red-600' :
                        alert.type === 'payment_due' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {alert.memberName} {alert.type === 'attendance_failure' ? 'Access Issue' : 
                              alert.type === 'payment_due' ? 'Payment Due' : 'Membership Expired'}
                          </h4>
                          <span className="text-xs text-muted-foreground">{formatTime(alert.time)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleResolveAlert(alert.id)}
                        className="shrink-0"
                      >
                        Resolve
                      </Button>
                    </div>
                  ))}
                  
                  {alerts.filter(alert => alert.status === 'unresolved').length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                      <h3 className="text-lg font-medium text-center">All clear!</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        No unresolved alerts at the moment
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default RealTimeDashboardPage;
