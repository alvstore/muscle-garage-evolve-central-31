import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { useDashboard } from "@/hooks/use-dashboard";
import StaffStatsOverview from "@/components/dashboard/staff/StaffStatsOverview";
import { useAttendanceStats, useRevenueStats, useMembershipStats } from "@/hooks/use-stats";

const StaffDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const { dashboardData, isLoading } = useDashboard();

  useEffect(() => {
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    setEndDate(new Date());
  }, []);

  const getFormattedDate = (date: Date | undefined): string => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  const { data: attendanceData } = useAttendanceStats('daily', getFormattedDate(startDate), getFormattedDate(endDate));
  const { data: paymentsData } = useRevenueStats('daily', getFormattedDate(startDate), getFormattedDate(endDate));

  const getAttendanceData = () => {
    return attendanceData?.map(item => ({
      date: item.date,
      members: item.members ? item.members.length : 0
    })) || [];
  };

  const getPaymentsData = () => {
    return paymentsData?.map(item => ({
      date: item.date,
      members: item.members ? item.members.length : 0
    })) || [];
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

        <StaffStatsOverview isLoading={isLoading} dashboardData={dashboardData} />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-4">
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
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Payments</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getPaymentsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="members" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
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
