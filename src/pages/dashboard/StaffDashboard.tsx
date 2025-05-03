
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useDashboard } from "@/hooks/use-dashboard";
import StaffStatsOverview from "@/components/dashboard/staff/StaffStatsOverview";
import { useRevenueStats, DateRange } from "@/hooks/use-stats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2, PlusCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";

interface Trainer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  branch_id?: string;
  status?: string;
  branch_name?: string;
  avatar_url?: string;
  rating?: number;
}

const StaffDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  });
  const { dashboardData, isLoading } = useDashboard();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial setup is already handled by the useState initialization
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setLoadingTrainers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          department,
          branch_id,
          avatar_url,
          rating,
          branches:branch_id (name)
        `)
        .eq('role', 'trainer')
        .limit(3); // Limit to 3 trainers for the dashboard
      
      if (error) throw error;
      
      const formattedData = data.map(trainer => ({
        id: trainer.id,
        full_name: trainer.full_name || '',
        email: trainer.email || '',
        phone: trainer.phone || '',
        specialization: trainer.department || '',
        branch_id: trainer.branch_id || '',
        branch_name: trainer.branches ? (trainer.branches as any).name : '',
        status: 'active', // Assuming all fetched trainers are active
        avatar_url: trainer.avatar_url || '',
        rating: trainer.rating || 0
      }));
      
      setTrainers(formattedData);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoadingTrainers(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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

  const handleViewAllTrainers = () => {
    navigate('/trainers');
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

        <StaffStatsOverview isLoading={isLoading} dashboardData={dashboardData} />

        {/* Trainers Section */}
        <div className="mt-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Trainers</h2>
            <Button variant="outline" size="sm" onClick={handleViewAllTrainers}>
              <PlusCircle className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          
          {loadingTrainers ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trainers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No trainers found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trainers.map((trainer) => (
                <Card key={trainer.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24 flex items-center justify-center">
                      <div className="flex items-center justify-center">
                        <div className="flex space-x-1 mt-12">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                (trainer.rating || 0) >= star
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-14 relative">
                    <div className="absolute -top-10 left-6">
                      <Avatar className="h-16 w-16 border-4 border-background">
                        {trainer.avatar_url ? (
                          <AvatarImage src={trainer.avatar_url} alt={trainer.full_name} />
                        ) : (
                          <AvatarFallback className="text-lg font-medium">
                            {getInitials(trainer.full_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{trainer.full_name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {trainer.email}
                        </p>
                        {trainer.phone && (
                          <p className="text-muted-foreground text-sm">
                            {trainer.phone}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {trainer.specialization && (
                          <Badge variant="secondary">{trainer.specialization}</Badge>
                        )}
                        {trainer.branch_name && (
                          <Badge variant="outline">{trainer.branch_name}</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

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
