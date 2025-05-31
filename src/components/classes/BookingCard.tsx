
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClassBooking } from '@/types/class';

interface BookingCardProps {
  booking: ClassBooking;
  onClick?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'attended':
        return 'success' as any;
      case 'cancelled':
        return 'destructive';
      case 'no-show':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">
            {booking.memberName || 'Unknown Member'}
          </CardTitle>
          <Badge variant={getStatusVariant(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground space-y-1">
          {booking.bookingDate && (
            <p>Booked: {new Date(booking.bookingDate).toLocaleDateString()}</p>
          )}
          {booking.attendanceTime && (
            <p>Attended: {new Date(booking.attendanceTime).toLocaleString()}</p>
          )}
          {booking.notes && (
            <p className="mt-2 text-xs">{booking.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
