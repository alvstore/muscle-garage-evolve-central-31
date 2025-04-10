
export type BookingStatus = "confirmed" | "cancelled" | "attended" | "missed" | "pending";

export interface ClassBooking {
  id: string;
  classId: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  bookingDate: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  attendanceTime?: string;
  notes?: string;
}
