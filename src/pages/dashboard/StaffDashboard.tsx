
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useDashboard } from "@/hooks/use-dashboard";
import StaffStatsOverview from "@/components/dashboard/staff/StaffStatsOverview";
import { useRevenueStats, DateRange } from "@/hooks/use-stats";

const StaffDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  });
  const { dashboardData, isLoading } = useDashboard();

  useEffect(() => {
    // Initial setup is already handled by the useState initialization
  }, []);

  // Use an empty mock for attendance data temporarily
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [25, 30, 22, 28, 35, 40, 20]
  };
  
  const { data: paymentsData } = useRevenueStats(dateRange);

  const getAttendanceData = () => {
    if (!attendanceData) return [];
    return attendanceData.labels.map((date, index) => ({
      date,
      members: attendanceData.data[index] || 0
    }));
  };

  const getPaymentsData = () => {
    if (!paymentsData) return [];
    return paymentsData.labels.map((date, index) => ({
      date,
      revenue: paymentsData.data[index] || 0
    }));
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

        <StaffStatsOverview isLoading={isLoading} dashboardData={dashboardData} />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <h2 className="text-lg font-semibold">Attendance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getAttendanceData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <h2 className="text-lg font-semibold">Payments</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getPaymentsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardContent className="flex flex-col gap-4 pt-6">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              className="rounded-md border" 
            />
            {date ? (
              <p>
                You selected {format(date, "PPP")}.
              </p>
            ) : (
              <p>Please select a date.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default StaffDashboard;
