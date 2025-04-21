
export interface AttendanceEntry {
  id?: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  accessMethod: string;
  branch: string;
  status: string;
  time: string;
  type: "check-in" | "check-out";
  location?: string;
  device?: string;
}
