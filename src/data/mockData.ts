
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

// Mock users data
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

// Alias for dashboards to use
export const mockUsers = users;

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
    startTime: "2023-07-10T18:00:00",
    endTime: "2023-07-10T19:00:00",
    capacity: 20,
    enrolled: 15,
    trainer: "Jane Smith",
    difficulty: "Advanced",
    type: "HIIT",
    location: "Studio A",
  },
  {
    id: "class2",
    name: "Yoga Flow",
    description: "Vinyasa-style yoga to improve flexibility and strength.",
    trainerId: "trainer2",
    startTime: "2023-07-11T19:00:00",
    endTime: "2023-07-11T20:00:00",
    capacity: 15,
    enrolled: 12,
    trainer: "Mike Johnson",
    difficulty: "Intermediate",
    type: "Yoga",
    location: "Studio B",
  },
  {
    id: "class3",
    name: "CrossFit WOD",
    description: "Workout of the day focusing on functional movements.",
    trainerId: "trainer3",
    startTime: "2023-07-15T09:00:00",
    endTime: "2023-07-15T10:00:00",
    capacity: 10,
    enrolled: 8,
    trainer: "Emily White",
    difficulty: "Advanced",
    type: "CrossFit",
    location: "Main Floor",
  },
];

// Alias for dashboards to use
export const mockClasses = classes;

// Mock data for memberships
export const memberships: Membership[] = [
  {
    id: "membership1",
    name: "Basic",
    price: 50,
    duration: 30,
    features: ["Gym access", "Basic equipment"],
    isActive: true,
  },
  {
    id: "membership2",
    name: "Premium",
    price: 100,
    duration: 30,
    features: ["All classes", "All equipment", "Personal training session"],
    isActive: true,
  },
  {
    id: "membership3",
    name: "Annual",
    price: 900,
    duration: 365,
    features: ["All classes", "All equipment", "Unlimited personal training"],
    isActive: true,
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
    createdAt: "2023-01-01T00:00:00Z",
    author: "Admin",
    priority: "high",
    targetRoles: ["member"],
    channels: ["email", "push"],
  },
  {
    id: "announcement2",
    title: "Gym Closure",
    content: "The gym will be closed for maintenance on July 15th.",
    createdAt: "2023-07-10T00:00:00Z",
    author: "Admin",
    priority: "medium",
    targetRoles: ["member", "trainer"],
    channels: ["email", "sms"],
  },
  {
    id: "announcement3",
    title: "New Class Alert",
    content: "A new Zumba class will be starting next week.",
    createdAt: "2023-07-12T00:00:00Z",
    author: "Admin",
    priority: "low",
    targetRoles: ["member"],
    channels: ["push"],
  },
];

// Alias for dashboards to use
export const mockAnnouncements = announcements;

// Fix the dashboard summary to use totalRevenue instead of revenue
export const dashboardSummary: DashboardSummary = {
  activeMemberships: 342,
  totalRevenue: 48250,
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

// Alias for dashboards to use
export const mockMembers = members;
