
import { 
  Member, 
  Class, 
  Announcement, 
  DashboardSummary,
  Trainer
} from '@/types';

// Mock classes for the app
export const mockClasses: Class[] = [
  {
    id: "class1",
    name: "Morning HIIT",
    description: "High-intensity interval training to kickstart your day",
    startTime: "07:00",
    endTime: "08:00",
    capacity: 20,
    enrolled: 15,
    trainer: "Jane Smith",
    trainerName: "Jane Smith",
    trainerAvatar: "/avatars/trainer1.jpg",
    trainerId: "trainer1",
    difficulty: "Intermediate",
    type: "HIIT",
    location: "Main Studio",
    status: "Active",
    schedule: "Monday, Wednesday, Friday"
  },
  {
    id: "class2",
    name: "Yoga Flow",
    description: "Relaxing yoga session to improve flexibility and mindfulness",
    startTime: "10:00",
    endTime: "11:00",
    capacity: 15,
    enrolled: 12,
    trainer: "Mark Johnson",
    trainerName: "Mark Johnson",
    trainerAvatar: "/avatars/trainer2.jpg",
    trainerId: "trainer2",
    difficulty: "Beginner",
    type: "Yoga",
    location: "Yoga Studio",
    status: "Active",
    schedule: "Tuesday, Thursday"
  },
  {
    id: "class3",
    name: "Spinning",
    description: "High-energy indoor cycling workout",
    startTime: "18:00",
    endTime: "19:00",
    capacity: 15,
    enrolled: 14,
    trainer: "Sarah Williams",
    trainerName: "Sarah Williams",
    trainerAvatar: "/avatars/trainer3.jpg",
    trainerId: "trainer3",
    difficulty: "Advanced",
    type: "Cardio",
    location: "Cycling Room",
    status: "Active",
    schedule: "Monday, Wednesday, Friday"
  }
];

// Mock announcements
export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Holiday Hours",
    content: "We will be operating on reduced hours during the upcoming holiday period. Please check the schedule at the front desk.",
    createdAt: "2023-08-10T10:00:00Z",
    author: "Admin Staff",
    priority: "high",
    targetRoles: ["member", "trainer", "staff"],
    channels: ["email", "in-app"],
    createdBy: "admin1"
  },
  {
    id: "2",
    title: "New Yoga Class",
    content: "We're excited to announce a new yoga class starting next week. Sign up at the front desk or through the app.",
    createdAt: "2023-08-09T14:30:00Z",
    author: "Fitness Manager",
    priority: "medium",
    targetRoles: ["member"],
    channels: ["in-app"],
    createdBy: "manager1"
  },
  {
    id: "3",
    title: "Maintenance Notice",
    content: "The pool will be closed for maintenance on Saturday from 2pm to 5pm. We apologize for any inconvenience.",
    createdAt: "2023-08-08T08:15:00Z",
    author: "Facilities Team",
    priority: "low",
    targetRoles: ["member", "trainer"],
    channels: ["email", "sms", "in-app"],
    createdBy: "facilities1"
  }
];

// Mock trainers
export const mockTrainers: Trainer[] = [
  {
    id: "trainer1",
    name: "Jane Smith",
    specialization: ["HIIT", "Strength Training", "Weight Loss"],
    experience: 5,
    certifications: ["ACE", "NASM"],
    bio: "Jane is a passionate fitness enthusiast with over 5 years of experience in high-intensity training and strength conditioning.",
    profileImage: "/avatars/trainer1.jpg",
    contactNumber: "555-0101",
    email: "jane.smith@example.com",
    availability: ["Morning", "Afternoon"],
    rating: 4.8,
    reviewCount: 56,
    branchId: "branch1"
  },
  {
    id: "trainer2",
    name: "Mark Johnson",
    specialization: ["Yoga", "Pilates", "Meditation"],
    experience: 8,
    certifications: ["Yoga Alliance", "PMA"],
    bio: "Mark specializes in mind-body wellness with extensive training in various yoga practices and mindfulness techniques.",
    profileImage: "/avatars/trainer2.jpg",
    contactNumber: "555-0102",
    email: "mark.johnson@example.com",
    availability: ["Morning", "Evening"],
    rating: 4.9,
    reviewCount: 64,
    branchId: "branch1"
  },
  {
    id: "trainer3",
    name: "Sarah Williams",
    specialization: ["Cycling", "Cardio", "Endurance Training"],
    experience: 6,
    certifications: ["Spinning®", "AFAA"],
    bio: "Sarah is an energetic trainer specializing in cardiovascular fitness and endurance building programs.",
    profileImage: "/avatars/trainer3.jpg",
    contactNumber: "555-0103",
    email: "sarah.williams@example.com",
    availability: ["Afternoon", "Evening"],
    rating: 4.7,
    reviewCount: 42,
    branchId: "branch2"
  }
];

// Mock members for the app with primary branch ID
export const mockMembers: Member[] = [
  {
    id: "member1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "member",
    avatar: "/avatars/member1.jpg",
    phone: "555-1234",
    address: "123 Main St, Anytown",
    dateOfBirth: "1990-05-15",
    goal: "Weight loss",
    trainerId: "trainer1",
    membershipId: "membership1",
    membershipStatus: "active",
    membershipStartDate: "2023-01-01",
    membershipEndDate: "2023-12-31",
    height: 175,
    weight: 80,
    chest: 100,
    waist: 85,
    biceps: 35,
    thigh: 55,
    hips: 95,
    bodyFat: 18,
    primaryBranchId: "branch1"
  },
  {
    id: "member2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "member",
    avatar: "/avatars/member2.jpg",
    phone: "555-5678",
    address: "456 Oak St, Anytown",
    dateOfBirth: "1988-09-23",
    goal: "Muscle gain",
    trainerId: "trainer2",
    membershipId: "membership2",
    membershipStatus: "active",
    membershipStartDate: "2023-02-15",
    membershipEndDate: "2024-02-14",
    height: 165,
    weight: 60,
    chest: 90,
    waist: 70,
    biceps: 28,
    thigh: 50,
    hips: 92,
    bodyFat: 22,
    primaryBranchId: "branch1"
  },
  {
    id: "member3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "member",
    avatar: "/avatars/member3.jpg",
    phone: "555-9012",
    address: "789 Pine St, Anytown",
    dateOfBirth: "1992-11-08",
    goal: "Improve endurance",
    trainerId: "trainer3",
    membershipId: "membership3",
    membershipStatus: "active",
    membershipStartDate: "2023-03-10",
    membershipEndDate: "2024-03-09",
    height: 180,
    weight: 75,
    chest: 105,
    waist: 80,
    biceps: 38,
    thigh: 58,
    hips: 90,
    bodyFat: 15,
    primaryBranchId: "branch2"
  },
  {
    id: "member4",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: "member",
    avatar: "/avatars/member4.jpg",
    phone: "555-3456",
    address: "101 Elm St, Anytown",
    dateOfBirth: "1995-04-20",
    goal: "Overall fitness",
    trainerId: "trainer1",
    membershipId: "membership4",
    membershipStatus: "expired",
    membershipStartDate: "2022-12-01",
    membershipEndDate: "2023-05-31",
    height: 160,
    weight: 55,
    chest: 85,
    waist: 65,
    biceps: 25,
    thigh: 48,
    hips: 88,
    bodyFat: 24,
    primaryBranchId: "branch1"
  },
  {
    id: "member5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "member",
    avatar: "/avatars/member5.jpg",
    phone: "555-7890",
    address: "202 Maple St, Anytown",
    dateOfBirth: "1987-07-12",
    goal: "Flexibility",
    trainerId: "trainer2",
    membershipId: "membership5",
    membershipStatus: "inactive",
    membershipStartDate: "2023-01-15",
    membershipEndDate: "2023-07-14",
    height: 178,
    weight: 82,
    chest: 108,
    waist: 88,
    biceps: 36,
    thigh: 60,
    hips: 96,
    bodyFat: 20,
    primaryBranchId: "branch2"
  }
];

// Mock dashboard summary data
export const mockDashboardSummary: DashboardSummary = {
  activeMemberships: 382,
  totalRevenue: 58200, // Using totalRevenue instead of revenue
  newMembers: 24,
  upcomingClasses: 15,
  occupancyRate: 78,
  totalMembers: 450,
  todayCheckIns: 128,
  pendingPayments: 12,
  upcomingRenewals: 32,
  attendanceTrend: [
    { date: "2023-07-01", count: 120 },
    { date: "2023-07-02", count: 115 },
    { date: "2023-07-03", count: 130 },
    { date: "2023-07-04", count: 105 },
    { date: "2023-07-05", count: 142 },
    { date: "2023-07-06", count: 135 },
    { date: "2023-07-07", count: 128 }
  ]
};
