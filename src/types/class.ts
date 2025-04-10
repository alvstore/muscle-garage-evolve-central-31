
export type ClassDifficulty = "beginner" | "intermediate" | "advanced" | "all";
export type ClassStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
export type BookingStatus = "booked" | "attended" | "cancelled" | "no-show";

export interface GymClass {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar?: string;
  capacity: number;
  enrolled: number;
  startTime: string;
  endTime: string;
  type: string;
  location?: string;
  difficulty: ClassDifficulty;
  status: ClassStatus;
  recurring: boolean;
  recurringPattern?: string; // e.g., "MON,WED,FRI" or "WEEKLY"
  createdAt: string;
  updatedAt: string;
}

export interface ClassBooking {
  id: string;
  classId: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  bookingDate: string;
  status: BookingStatus;
  attendanceTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFilter {
  date?: string;
  trainerId?: string;
  type?: string;
  difficulty?: ClassDifficulty;
  status?: ClassStatus;
}
