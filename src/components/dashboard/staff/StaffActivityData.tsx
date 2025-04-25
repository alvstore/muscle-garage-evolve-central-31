
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
      },
      time: "10 minutes ago",
      type: "membership"
    },
    {
      id: "2",
      title: "Class Attendance",
      description: "Michael Wong checked in for HIIT Extreme class",
      user: {
        name: "Michael Wong",
        avatar: "/placeholder.svg",
      },
      time: "30 minutes ago",
      type: "check-in"
    },
    {
      id: "3",
      title: "Payment Received",
      description: "Emily Davidson paid $99 for Standard Monthly membership",
      user: {
        name: "Emily Davidson",
        avatar: "/placeholder.svg",
      },
      time: "1 hour ago",
      type: "payment"
    }
  ];

  const pendingPayments: Payment[] = [
    {
      id: "payment1",
      memberId: "member2",
      memberName: "Sarah Parker",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Standard Monthly",
      amount: 99,
      dueDate: "2023-07-25T00:00:00Z",
      status: "pending",
      contactInfo: "+1234567894",
    },
    {
      id: "payment2",
      memberId: "member5",
      memberName: "David Miller",
      memberAvatar: "/placeholder.svg",
      membershipPlan: "Premium Annual",
      amount: 999,
      dueDate: "2023-07-15T00:00:00Z",
      status: "overdue",
      contactInfo: "+1234567897",
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
