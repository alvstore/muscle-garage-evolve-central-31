
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
}
