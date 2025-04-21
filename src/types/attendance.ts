
export interface AttendanceEntry {
  id?: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  accessMethod: string;
  branch: string;
  status: string;
  time: string;  // Required by the component
  type: string;  // Required by the component
}
