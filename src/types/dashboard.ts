
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  audience: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_members: number;
  active_members: number;
  new_members_this_month: number;
  revenue_this_month: number;
  revenue_last_month: number;
  attendance_today: number;
  upcoming_renewals: number;
  expiring_this_week: number;
}
