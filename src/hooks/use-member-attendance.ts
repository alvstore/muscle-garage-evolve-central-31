
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { AttendanceEntry } from '@/types/attendance';

export const useMemberAttendance = (attendanceData: AttendanceEntry[]) => {
  const { user } = useAuth();
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceEntry[]>([]);
  
  useEffect(() => {
    // Only show attendance for the logged-in member
    if (user && user.role === 'member') {
      const memberAttendance = attendanceData.filter(
        entry => entry.memberId === user.id
      );
      setFilteredAttendance(memberAttendance);
    } else {
      // For admins, staff, and trainers, show all attendance data
      setFilteredAttendance(attendanceData);
    }
  }, [attendanceData, user]);
  
  return filteredAttendance;
};
