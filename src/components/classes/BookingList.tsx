
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassBooking } from '@/types/class';
import { useBranch } from '@/hooks/settings/use-branches';
import { Search, Calendar, Users, Clock } from 'lucide-react';
import BookingCard from './BookingCard';

const BookingList = () => {
  const { currentBranch } = useBranch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - replace with actual API call
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', currentBranch?.id],
    queryFn: () => Promise.resolve([]), // Replace with actual service call
    enabled: !!currentBranch?.id,
  });

  const filteredBookings = bookings.filter((booking: ClassBooking) => {
    const matchesSearch = booking.memberName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    // Add date filtering logic here
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: bookings.length,
      confirmed: bookings.filter((b: ClassBooking) => b.status === 'confirmed').length,
      attended: bookings.filter((b: ClassBooking) => b.status === 'attended').length,
      cancelled: bookings.filter((b: ClassBooking) => b.status === 'cancelled').length,
      'no-show': bookings.filter((b: ClassBooking) => b.status === 'no-show').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Class Bookings</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="attended">Attended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Confirmed ({statusCounts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="attended" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attended ({statusCounts.attended})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({statusCounts.cancelled})
          </TabsTrigger>
          <TabsTrigger value="no-show">
            No Show ({statusCounts['no-show']})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking: ClassBooking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => {
                  // Handle booking click
                  console.log('Booking clicked:', booking.id);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings
              .filter((booking: ClassBooking) => booking.status === 'confirmed')
              .map((booking: ClassBooking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => {
                    console.log('Confirmed booking clicked:', booking.id);
                  }}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="attended" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings
              .filter((booking: ClassBooking) => booking.status === 'attended')
              .map((booking: ClassBooking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => {
                    console.log('Attended booking clicked:', booking.id);
                  }}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings
              .filter((booking: ClassBooking) => booking.status === 'cancelled')
              .map((booking: ClassBooking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => {
                    console.log('Cancelled booking clicked:', booking.id);
                  }}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="no-show" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings
              .filter((booking: ClassBooking) => booking.status === 'no-show')
              .map((booking: ClassBooking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => {
                    console.log('No-show booking clicked:', booking.id);
                  }}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bookings found.</p>
        </div>
      )}
    </div>
  );
};

export default BookingList;
