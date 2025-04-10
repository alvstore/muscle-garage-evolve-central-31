import {
  DashboardSummary,
  Member,
  Trainer,
  Class,
  Membership,
  Payment,
  User,
} from "@/types";
import {
  Announcement,
  Feedback,
  MotivationalMessage,
  ReminderRule,
} from "@/types/notification";
import { format, subDays } from "date-fns";

// Mock data for trainers
export const trainers: Trainer[] = [
  {
    id: "trainer1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "trainer",
    specialization: ["Cardio", "Strength Training"],
    experience: 5,
    certifications: ["ACE", "NASM"],
  },
  {
    id: "trainer2",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "trainer",
    specialization: ["Yoga", "Pilates"],
    experience: 8,
    certifications: ["RYT 200", "Balanced Body"],
  },
  {
    id: "trainer3",
    name: "Emily White",
    email: "emily.white@example.com",
    role: "trainer",
    specialization: ["CrossFit", "HIIT"],
    experience: 3,
    certifications: ["CrossFit Level 1", "ISSA"],
  },
];

// Mock data for classes
export const classes: Class[] = [
  {
    id: "class1",
    name: "HIIT Blast",
    description: "High-intensity interval training for maximum calorie burn.",
    trainerId: "trainer1",
    schedule: "Mondays and Wednesdays at 6:00 PM",
    capacity: 20,
    enrolled: 15,
  },
  {
    id: "class2",
    name: "Yoga Flow",
    description: "Vinyasa-style yoga to improve flexibility and strength.",
    trainerId: "trainer2",
    schedule: "Tuesdays and Thursdays at 7:00 PM",
    capacity: 15,
    enrolled: 12,
  },
  {
    id: "class3",
    name: "CrossFit WOD",
    description: "Workout of the day focusing on functional movements.",
    trainerId: "trainer3",
    schedule: "Saturdays at 9:00 AM",
    capacity: 10,
    enrolled: 8,
  },
];

// Mock data for memberships
export const memberships: Membership[] = [
  {
    id: "membership1",
    name: "Basic",
    description: "Access to gym and basic equipment.",
    price: 50,
    duration: "Monthly",
    features: ["Gym access", "Basic equipment"],
  },
  {
    id: "membership2",
    name: "Premium",
    description: "Access to all classes and equipment.",
    price: 100,
    duration: "Monthly",
    features: ["All classes", "All equipment", "Personal training session"],
  },
  {
    id: "membership3",
    name: "Annual",
    description: "Full access for a year.",
    price: 900,
    duration: "Annual",
    features: ["All classes", "All equipment", "Unlimited personal training"],
  },
];

// Mock data for payments
export const payments: Payment[] = [
  {
    id: "payment1",
    memberId: "member1",
    membershipId: "membership1",
    amount: 50,
    date: "2023-07-01",
    status: "Paid",
  },
  {
    id: "payment2",
    memberId: "member2",
    membershipId: "membership2",
    amount: 100,
    date: "2023-07-05",
    status: "Paid",
  },
  {
    id: "payment3",
    memberId: "member3",
    membershipId: "membership3",
    amount: 900,
    date: "2023-07-10",
    status: "Paid",
  },
];

// Mock data for announcements
export const announcements: Announcement[] = [
  {
    id: "announcement1",
    title: "New Year Promotion",
    content: "Get 20% off on all annual memberships this January!",
    date: "2023-01-01",
    author: "Admin",
    priority: "high",
    targetRoles: ["member"],
  },
  {
    id: "announcement2",
    title: "Gym Closure",
    content: "The gym will be closed for maintenance on July 15th.",
    date: "2023-07-10",
    author: "Admin",
    priority: "medium",
    targetRoles: ["member", "trainer"],
  },
  {
    id: "announcement3",
    title: "New Class Alert",
    content: "A new Zumba class will be starting next week.",
    date: "2023-07-12",
    author: "Admin",
    priority: "low",
    targetRoles: ["member"],
  },
];

// Mock data for users
export const users: User[] = [
  {
    id: "admin1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "admin",
  },
  {
    id: "staff1",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    role: "staff",
  },
  {
    id: "trainer1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "trainer",
  },
  {
    id: "member1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "member",
  },
  {
    id: "member2",
    name: "Sarah Parker",
    email: "sarah.parker@example.com",
    role: "member",
  },
  {
    id: "member3",
    name: "David Miller",
    email: "david.miller@example.com",
    role: "member",
  },
];

// Fix the dashboard summary to use totalRevenue instead of revenue
export const dashboardSummary: DashboardSummary = {
  activeMemberships: 342,
  totalRevenue: 48250, // Changed from revenue to totalRevenue
  newMembers: 27,
  upcomingClasses: 15,
  occupancyRate: 78,
  totalMembers: 450,
  todayCheckIns: 87,
  pendingPayments: 12,
  upcomingRenewals: 23,
  attendanceTrend: Array(7)
    .fill(0)
    .map((_, i) => ({
      date: format(subDays(new Date(), 6 - i), "yyyy-MM-dd"),
      count: 50 + Math.floor(Math.random() * 40),
    }),
    ),
};

// Ensure primaryBranchId exists in all member objects
export const members: Member[] = [
  {
    id: "member1",
    name: "John Doe",
    email: "john@example.com",
    role: "member",
    avatar: "/avatars/avatar-1.png",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    dateOfBirth: "1985-05-15",
    membershipStatus: "active",
    membershipStartDate: "2023-01-10",
    membershipEndDate: "2023-12-31",
    primaryBranchId: "branch1",
    height: 175,
    weight: 80,
    goal: "Weight loss and muscle toning",
  },
  {
    id: "member2",
    name: "Sarah Parker",
    email: "sarah@example.com",
    role: "member",
    avatar: "/avatars/avatar-2.png",
    phone: "555-987-6543",
    address: "456 Elm St, Anytown, USA",
    dateOfBirth: "1990-11-20",
    membershipStatus: "active",
    membershipStartDate: "2023-02-15",
    membershipEndDate: "2024-02-15",
    primaryBranchId: "branch2",
    height: 163,
    weight: 68,
    goal: "Improve overall fitness",
  },
  {
    id: "member3",
    name: "David Miller",
    email: "david@example.com",
    role: "member",
    avatar: "/avatars/avatar-3.png",
    phone: "555-246-8012",
    address: "789 Oak St, Anytown, USA",
    dateOfBirth: "1988-07-04",
    membershipStatus: "inactive",
    membershipStartDate: "2022-03-01",
    membershipEndDate: "2023-03-01",
    primaryBranchId: "branch1",
    height: 180,
    weight: 95,
    goal: "Muscle building",
  },
  {
    id: "member4",
    name: "Emily White",
    email: "emily@example.com",
    role: "member",
    avatar: "/avatars/avatar-4.png",
    phone: "555-135-7913",
    address: "101 Pine St, Anytown, USA",
    dateOfBirth: "1992-09-28",
    membershipStatus: "active",
    membershipStartDate: "2023-04-10",
    membershipEndDate: "2024-04-10",
    primaryBranchId: "branch3",
    height: 170,
    weight: 72,
    goal: "Cardiovascular health",
  },
  {
    id: "member5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "member",
    avatar: "/avatars/avatar-5.png",
    phone: "555-864-2048",
    address: "222 Cedar St, Anytown, USA",
    dateOfBirth: "1986-12-12",
    membershipStatus: "active",
    membershipStartDate: "2023-05-20",
    membershipEndDate: "2024-05-20",
    primaryBranchId: "branch2",
    height: 185,
    weight: 88,
    goal: "Strength and endurance",
  },
];
