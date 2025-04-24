
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FilePdf, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';

const ReportsDashboard = () => {
  const handleExport = (format: string) => {
    toast.info(`Exporting report in ${format} format...`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('xlsx')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export XLSX
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FilePdf className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <DatePickerWithRange />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {["members", "attendance", "payments", "invoices", "expenses", "referrals", "crm", "inventory"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{tab} Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed {tab} reports will be shown here with filtering and export options.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ReportsDashboard;
