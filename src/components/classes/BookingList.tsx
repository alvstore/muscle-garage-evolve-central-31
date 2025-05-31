
import React from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, Clock, X, UserCheck, UserX } from 'lucide-react';
import { ClassBooking, BookingStatus } from '@/types/class';
import { getInitials } from '@/utils/stringUtils';

// Sample data for demonstration
export const mockBookings: ClassBooking[] = [
  {
    id: '1',
    class_id: 'class1',
    member_id: 'member1',
    memberName: 'Jane Smith',
    memberAvatar: '/avatar-1.jpg',
    bookingDate: '2023-04-15T08:00:00Z',
    status: 'confirmed',
    attended: false,
    created_at: '2023-04-10T12:00:00Z',
    updated_at: '2023-04-10T12:00:00Z'
  },
  {
    id: '2',
    class_id: 'class1',
    member_id: 'member2',
    memberName: 'John Doe',
    memberAvatar: '/avatar-2.jpg',
    bookingDate: '2023-04-15T08:00:00Z',
    status: 'booked',
    attended: false,
    created_at: '2023-04-11T10:00:00Z',
    updated_at: '2023-04-11T10:00:00Z'
  },
  {
    id: '3',
    class_id: 'class1',
    member_id: 'member3',
    memberName: 'Sara Wilson',
    memberAvatar: '/avatar-3.jpg',
    bookingDate: '2023-04-15T08:00:00Z',
    status: 'attended',
    attended: true,
    attendanceTime: '2023-04-15T08:05:00Z',
    created_at: '2023-04-12T09:00:00Z',
    updated_at: '2023-04-15T08:05:00Z'
  },
  {
    id: '4',
    class_id: 'class1',
    member_id: 'member4',
    memberName: 'Mike Johnson',
    memberAvatar: '',
    bookingDate: '2023-04-15T08:00:00Z',
    status: 'no-show',
    attended: false,
    notes: 'Did not show up for the second time',
    created_at: '2023-04-13T14:00:00Z',
    updated_at: '2023-04-15T09:00:00Z'
  }
];

interface BookingListProps {
  bookings?: ClassBooking[];
  onMarkAttended?: (booking: ClassBooking) => void;
  onMarkNoShow?: (booking: ClassBooking) => void;
  onCancel?: (booking: ClassBooking) => void;
  isHistorical?: boolean;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings = mockBookings,
  onMarkAttended,
  onMarkNoShow,
  onCancel,
  isHistorical = false
}) => {
  // Find bookings by status
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'waitlist');
  const attendedBookings = bookings.filter(b => b.status === 'attended');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled' || b.status === 'no-show');

  // If there are no bookings at all
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Confirmed/Waitlisted Bookings */}
      {confirmedBookings.length > 0 && (
        <div>
          <h3 className="font-medium text-lg mb-4">
            Confirmed Bookings ({confirmedBookings.length})
          </h3>
          <ul className="space-y-4">
            {confirmedBookings.map(booking => (
              <li key={booking.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                    <AvatarFallback>
                      {getInitials(booking.memberName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{booking.memberName || 'Unknown Member'}</div>
                    <div className="text-sm text-gray-500">
                      Booked: {booking.bookingDate ? format(new Date(booking.bookingDate), 'MMM d, yyyy') : 'Unknown date'}
                    </div>
                  </div>
                </div>
                
                {!isHistorical && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center"
                      onClick={() => onCancel?.(booking)}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => onMarkAttended?.(booking)}
                    >
                      <CheckIcon className="h-4 w-4 mr-1" /> Check In
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Attended Bookings */}
      {attendedBookings.length > 0 && (
        <div>
          <h3 className="font-medium text-lg mb-4">
            Attended ({attendedBookings.length})
          </h3>
          <ul className="space-y-4">
            {attendedBookings.map(booking => (
              <li key={booking.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                    <AvatarFallback>
                      {getInitials(booking.memberName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{booking.memberName || 'Unknown Member'}</div>
                    <div className="text-sm text-gray-500">
                      Booked: {booking.bookingDate ? format(new Date(booking.bookingDate), 'MMM d, yyyy') : 'Unknown date'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {booking.attendanceTime ? format(new Date(booking.attendanceTime), 'h:mm a') : 'Check-in recorded'}
                    </span>
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cancelled/No-Show Bookings */}
      {cancelledBookings.length > 0 && (
        <div>
          <h3 className="font-medium text-lg mb-4">
            Cancelled/No-Show ({cancelledBookings.length})
          </h3>
          <ul className="space-y-4">
            {cancelledBookings.map(booking => (
              <li key={booking.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.memberAvatar} alt={booking.memberName} />
                    <AvatarFallback>
                      {getInitials(booking.memberName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{booking.memberName || 'Unknown Member'}</div>
                    <div className="text-sm text-gray-500">
                      Booked: {booking.bookingDate ? format(new Date(booking.bookingDate), 'MMM d, yyyy') : 'Unknown date'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Badge variant={booking.status === 'no-show' ? 'destructive' : 'secondary'}>
                    {booking.status === 'no-show' ? 'No-Show' : 'Cancelled'}
                  </Badge>
                  
                  {booking.notes && (
                    <div className="text-sm text-gray-500 mt-2">
                      Note: {booking.notes}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingList;
