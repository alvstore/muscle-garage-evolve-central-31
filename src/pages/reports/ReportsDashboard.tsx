
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from '@/hooks/stats/use-stats';
import { format, subDays } from 'date-fns';

const ReportsDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>();

  // Mock data - will be replaced with real data from hooks
  const attendanceData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    data: [45, 52, 49, 60, 55, 38, 30]
  };
  
  const membershipData = {
    labels: ['New', 'Renewed', 'Expired', 'Cancelled'],
    data: [35, 42, 8, 5]
  };
  
  const branches = [
    { id: '1', name: 'Downtown Branch' },
    { id: '2', name: 'Westside Branch' },
    { id: '3', name: 'Northside Branch' },
  ];

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <Select 
              value={selectedBranch} 
              onValueChange={setSelectedBranch}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-branches">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground">
              {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p>Attendance chart goes here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Membership Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p>Membership chart goes here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p>Revenue chart goes here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p>Utilization chart goes here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ReportsDashboard;
