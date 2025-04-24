
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseData } from '@/hooks/use-supabase-data';
import { useBranch } from '@/hooks/use-branch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReportsDashboard = () => {
  const [reportType, setReportType] = useState('members');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [exportFormat, setExportFormat] = useState('xlsx');
  const { currentBranch } = useBranch();
  
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  const handleExport = (format: string) => {
    toast.info(`Exporting ${reportType} report in ${format} format...`);
    // In a real implementation, we would generate the report here
    setTimeout(() => {
      toast.success(`${reportType} report exported successfully`);
    }, 1500);
  };

  // Fetch member data
  const { data: members, loading: loadingMembers } = useSupabaseData('members', {
    columns: 'id, name, email, phone, membership_status, branch_id, created_at',
    orderBy: 'created_at.desc',
    branchId: currentBranch?.id
  });

  // Fetch finance data
  const { data: transactions, loading: loadingTransactions } = useSupabaseData('transactions', {
    columns: 'id, type, amount, transaction_date, description, category_id, branch_id',
    orderBy: 'transaction_date.desc',
    branchId: currentBranch?.id
  });

  // Fetch attendance data
  const { data: attendance, loading: loadingAttendance } = useSupabaseData('member_attendance', {
    columns: 'id, member_id, check_in, check_out, branch_id',
    orderBy: 'check_in.desc',
    branchId: currentBranch?.id
  });

  const renderReportTable = () => {
    switch (reportType) {
      case 'members':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingMembers ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : members && members.length > 0 ? (
                members.slice(0, 10).map((member: any) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.membership_status}</TableCell>
                    <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No members found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );
      
      case 'finance':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingTransactions ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : transactions && transactions.length > 0 ? (
                transactions.slice(0, 10).map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>₹{transaction.amount}</TableCell>
                    <TableCell>{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No transactions found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );
      
      case 'attendance':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member ID</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAttendance ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : attendance && attendance.length > 0 ? (
                attendance.slice(0, 10).map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.member_id}</TableCell>
                    <TableCell>{new Date(record.check_in).toLocaleString()}</TableCell>
                    <TableCell>{record.check_out ? new Date(record.check_out).toLocaleString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No attendance records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );
      
      case 'crm':
        return (
          <div className="py-8 text-center">
            <p>CRM Reports will be available soon</p>
          </div>
        );
      
      case 'fitness':
        return (
          <div className="py-8 text-center">
            <p>Workout & Diet Reports will be available soon</p>
          </div>
        );
      
      default:
        return (
          <div className="py-8 text-center">
            <p>Select a report type to view data</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Export Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport(exportFormat)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <DateRangePicker onChange={handleDateRangeChange} />
            <Select value={currentBranch?.id || ''}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Branches</SelectItem>
                {/* Branch options would be populated here */}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="fitness">Workout & Diet</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReportTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Finance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReportTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReportTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>CRM Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReportTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fitness" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout & Diet Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReportTable()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsDashboard;
