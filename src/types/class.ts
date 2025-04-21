
export interface GymClass {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  trainer?: {
    id: string;
    name: string;
    avatar?: string;
  };
  capacity: number;
  enrolled: number;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  branchId?: string;
}

export interface ClassBooking {
  id: string;
  classId: string;
  className?: string;
  memberId: string;
  memberName?: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'waitlisted';
  attendanceStatus?: 'absent' | 'present' | 'late';
}
