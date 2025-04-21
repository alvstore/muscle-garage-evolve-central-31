
export interface AttendanceEntry {
  id?: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string | null;
  accessMethod: string;
  branch: string;
  status: string;
  time: string;  // Required by the component
  type: "check-in" | "check-out";  // Restricting to specific values
}
