
export type AttendanceType = "check-in" | "check-out";

export interface AttendanceEntry {
  id?: string;
  memberId: string;
  memberName?: string;
  time: string;
  type: AttendanceType;
  location?: string;
  device?: string;
  status?: string;
  checkInTime?: string;
  checkOutTime?: string;
  branchId?: string;
}

// Add BookingStatus to fix import errors
export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlisted' | 'attended' | 'no-show' | 'pending' | 'booked' | 'missed';
