import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberInvoiceList from "@/components/finance/MemberInvoiceList";
import WebhookLogs from "@/components/finance/WebhookLogs";
import { useAuth } from "@/hooks/use-auth";
import EnhancedInvoiceList from "@/components/finance/invoice/EnhancedInvoiceList";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns";

const InvoicePage = () => {
  const { user } = useAuth();
  const isMember = user?.role === "member";
  const [activeTab, setActiveTab] = useState(isMember ? "invoices" : "all-invoices");
  
  // Date range state
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const handleDateRangeChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case 'today':
        setStartDate(new Date(today.setHours(0, 0, 0, 0)));
        setEndDate(new Date());
        break;
      case 'week':
        setStartDate(startOfWeek(today));
        setEndDate(new Date());
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        setEndDate(new Date());
        break;
      case 'year':
        setStartDate(startOfYear(today));
        setEndDate(new Date());
        break;
      case 'custom':
        // Keep current dates when switching to custom
        break;
    }
    
    setDateRange(value as any);
  };

  if (isMember) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">My Invoices</h1>
          <MemberInvoiceList />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>
        
        <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-3">Filter Invoices</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="mb-2 block">Date Range</Label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div>
                  <Label className="mb-2 block">Start Date</Label>
                  <DatePicker
                    date={startDate}
                    onSelect={setStartDate}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">End Date</Label>
                  <DatePicker
                    date={endDate}
                    onSelect={setEndDate}
                  />
                </div>
              </>
            )}
          </div>
          
          {dateRange !== 'custom' ? (
            <p className="text-sm text-muted-foreground mt-2">
              Showing invoices from {startDate ? format(startDate, 'PPP') : ''} to {endDate ? format(endDate, 'PPP') : ''}
            </p>
          ) : null}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all-invoices">All Invoices</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="webhooks">Payment Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-invoices">
            <EnhancedInvoiceList 
              readOnly={false} 
              allowPayment={true}
              allowDownload={true}
              filter="all"
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <EnhancedInvoiceList 
              readOnly={false} 
              allowPayment={true}
              allowDownload={true}
              filter="pending"
            />
          </TabsContent>
          
          <TabsContent value="paid">
            <EnhancedInvoiceList 
              readOnly={false}
              allowPayment={false}
              allowDownload={true}
              filter="paid"
            />
          </TabsContent>
          
          <TabsContent value="overdue">
            <EnhancedInvoiceList 
              readOnly={false}
              allowPayment={true}
              allowDownload={true}
              filter="overdue"
            />
          </TabsContent>
          
          <TabsContent value="webhooks">
            <WebhookLogs />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default InvoicePage;
