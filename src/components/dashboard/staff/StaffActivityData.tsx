
import { ActivityItem, Payment, RenewalItem } from "@/types/dashboard";
import { Announcement } from "@/types/notification";

export const getStaffActivityData = () => {
  const recentActivities: ActivityItem[] = [
    {
      id: "1",
      title: "New Member Registration",
      description: "Sarah Parker has registered as a new member",
      user: {
        name: "Sarah Parker",
        avatar: "/placeholder.svg",
        id: "user1"
      },
      time: "10 minutes ago",
      type: "membership",
      timestamp: new Date().toISOString()
    },
    {
      id: "2",
      title: "Class Attendance",
      description: "Michael Wong checked in for HIIT Extreme class",
      user: {
        name: "Michael Wong",
        avatar: "/placeholder.svg",
        id: "user2"
      },
      time: "30 minutes ago",
      type: "check-in",
      timestamp: new Date().toISOString()
    },
    {
      id: "3",
      title: "Payment Received",
      description: "Emily Davidson paid $99 for Standard Monthly membership",
      user: {
        name: "Emily Davidson",
        avatar: "/placeholder.svg",
        id: "user3"
      },
      time: "1 hour ago",
      type: "payment",
      timestamp: new Date().toISOString()
    }
  ];

  const pendingPayments: Payment[] = [
    {
      id: "payment1",
      member_id: "member2",
      member_name: "Sarah Parker",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Standard Monthly",
      amount: 99,
      dueDate: "2023-07-25T00:00:00Z",
      status: "pending",
      contactInfo: "+1234567894",
      date: "2023-07-25T00:00:00Z",
    },
    {
      id: "payment2",
      member_id: "member5",
      member_name: "David Miller",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Premium Annual",
      amount: 999,
      dueDate: "2023-07-15T00:00:00Z",
      status: "overdue" as any,
      contactInfo: "+1234567897",
      date: "2023-07-15T00:00:00Z",
    }
  ];

  const announcements: Announcement[] = [
    {
      id: "announcement1",
      title: "Gym Closure for Maintenance",
      content: "The gym will be closed on July 15th for routine maintenance. We apologize for any inconvenience.",
      authorId: "admin1",
      authorName: "Admin User",
      createdAt: "2023-07-10T10:00:00Z",
      priority: "high",
      targetRoles: ["member", "trainer", "staff"],
      channels: ["in-app", "email"],
      channel: "all",
      branchId: "main-branch",
    },
    {
      id: "announcement2",
      title: "New Fitness Classes Added",
      content: "We're excited to announce new Zumba and Pilates classes starting next week!",
      authorId: "admin1",
      authorName: "Admin User",
      createdAt: "2023-07-12T14:30:00Z",
      priority: "medium",
      targetRoles: ["member", "trainer"],
      channels: ["in-app", "email"],
      channel: "all",
      branchId: "main-branch",
    }
  ];

  return {
    recentActivities,
    pendingPayments,
    announcements
  };
};
