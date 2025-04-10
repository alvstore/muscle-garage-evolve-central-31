
import { 
  User, 
  Member, 
  Trainer, 
  Staff, 
  Admin, 
  Class, 
  Membership,
  Announcement,
  DashboardSummary
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "admin1",
    email: "admin@musclegarage.com",
    name: "Alex Johnson",
    role: "admin",
    avatar: "/placeholder.svg",
    phone: "+1234567890"
  },
  {
    id: "staff1",
    email: "staff@musclegarage.com",
    name: "Taylor Smith",
    role: "staff",
    avatar: "/placeholder.svg",
    phone: "+1234567891"
  },
  {
    id: "trainer1",
    email: "trainer@musclegarage.com",
    name: "Chris Rodriguez",
    role: "trainer",
    avatar: "/placeholder.svg",
    phone: "+1234567892"
  },
  {
    id: "member1",
    email: "member@example.com",
    name: "Jordan Lee",
    role: "member",
    avatar: "/placeholder.svg",
    phone: "+1234567893"
  }
];

// Mock Members
export const mockMembers: Member[] = [
  {
    id: "member1",
    email: "member@example.com",
    name: "Jordan Lee",
    role: "member",
    avatar: "/placeholder.svg",
    phone: "+1234567893",
    dateOfBirth: "1990-05-15",
    goal: "Weight loss and muscle toning",
    trainerId: "trainer1",
    membershipId: "membership1",
    membershipStatus: "active",
    membershipStartDate: "2023-01-01",
    membershipEndDate: "2024-01-01"
  },
  {
    id: "member2",
    email: "sarahp@example.com",
    name: "Sarah Parker",
    role: "member",
    avatar: "/placeholder.svg",
    phone: "+1234567894",
    dateOfBirth: "1988-08-22",
    goal: "Bodybuilding",
    trainerId: "trainer2",
    membershipId: "membership2",
    membershipStatus: "active",
    membershipStartDate: "2023-02-15",
    membershipEndDate: "2023-08-15"
  },
  {
    id: "member3",
    email: "michaelw@example.com",
    name: "Michael Wong",
    role: "member",
    avatar: "/placeholder.svg",
    phone: "+1234567895",
    dateOfBirth: "1995-11-30",
    goal: "Strength training",
    trainerId: "trainer1",
    membershipId: "membership3",
    membershipStatus: "inactive",
    membershipStartDate: "2022-10-01",
    membershipEndDate: "2023-04-01"
  },
  {
    id: "member4",
    email: "emilyd@example.com",
    name: "Emily Davidson",
    role: "member",
    avatar: "/placeholder.svg",
    phone: "+1234567896",
    dateOfBirth: "1992-07-12",
    goal: "General fitness",
    trainerId: "trainer3",
    membershipId: "membership1",
    membershipStatus: "active",
    membershipStartDate: "2023-03-01",
    membershipEndDate: "2024-03-01"
  },
  {
    id: "member5",
    email: "davidm@example.com",
    name: "David Miller",
    role: "member",
    avatar: "/placeholder.svg",
    phone: "+1234567897",
    dateOfBirth: "1985-02-28",
    goal: "Marathon preparation",
    membershipId: "membership2",
    membershipStatus: "expired",
    membershipStartDate: "2022-06-01",
    membershipEndDate: "2023-06-01"
  }
];

// Mock Trainers
export const mockTrainers: Trainer[] = [
  {
    id: "trainer1",
    email: "trainer@musclegarage.com",
    name: "Chris Rodriguez",
    role: "trainer",
    avatar: "/placeholder.svg",
    phone: "+1234567892",
    specialty: "Weight Loss",
    bio: "Certified personal trainer with 8 years of experience specializing in weight management and functional training.",
    rating: 4.8
  },
  {
    id: "trainer2",
    email: "sam@musclegarage.com",
    name: "Sam Johnson",
    role: "trainer",
    avatar: "/placeholder.svg",
    phone: "+1234567898",
    specialty: "Bodybuilding",
    bio: "Former competitive bodybuilder with extensive knowledge in muscle hypertrophy and nutrition.",
    rating: 4.9
  },
  {
    id: "trainer3",
    email: "jessica@musclegarage.com",
    name: "Jessica Wu",
    role: "trainer",
    avatar: "/placeholder.svg",
    phone: "+1234567899",
    specialty: "Yoga & Flexibility",
    bio: "Yoga instructor and flexibility coach who focuses on mobility, balance, and mind-body connection.",
    rating: 4.7
  }
];

// Mock Staff
export const mockStaff: Staff[] = [
  {
    id: "staff1",
    email: "staff@musclegarage.com",
    name: "Taylor Smith",
    role: "staff",
    avatar: "/placeholder.svg",
    phone: "+1234567891",
    position: "Front Desk",
    department: "Operations"
  },
  {
    id: "staff2",
    email: "robert@musclegarage.com",
    name: "Robert Garcia",
    role: "staff",
    avatar: "/placeholder.svg",
    phone: "+1234567900",
    position: "Sales Associate",
    department: "Sales"
  }
];

// Mock Admins
export const mockAdmins: Admin[] = [
  {
    id: "admin1",
    email: "admin@musclegarage.com",
    name: "Alex Johnson",
    role: "admin",
    avatar: "/placeholder.svg",
    phone: "+1234567890"
  }
];

// Mock Classes
export const mockClasses: Class[] = [
  {
    id: "class1",
    name: "HIIT Extreme",
    description: "High-intensity interval training to maximize calorie burn and improve conditioning.",
    trainerId: "trainer1",
    capacity: 15,
    enrolled: 12,
    startTime: "2023-07-20T08:00:00Z",
    endTime: "2023-07-20T09:00:00Z",
    type: "Group",
    location: "Studio A"
  },
  {
    id: "class2",
    name: "Power Yoga",
    description: "Dynamic yoga practice focused on building strength and flexibility.",
    trainerId: "trainer3",
    capacity: 20,
    enrolled: 15,
    startTime: "2023-07-20T10:00:00Z",
    endTime: "2023-07-20T11:00:00Z",
    type: "Group",
    location: "Studio B"
  },
  {
    id: "class3",
    name: "Muscle Building 101",
    description: "Learn proper techniques for hypertrophy training.",
    trainerId: "trainer2",
    capacity: 10,
    enrolled: 8,
    startTime: "2023-07-20T17:00:00Z",
    endTime: "2023-07-20T18:00:00Z",
    type: "Workshop",
    location: "Weight Room"
  },
  {
    id: "class4",
    name: "Spin Class",
    description: "High-energy indoor cycling workout set to motivating music.",
    trainerId: "trainer1",
    capacity: 25,
    enrolled: 20,
    startTime: "2023-07-21T07:00:00Z",
    endTime: "2023-07-21T08:00:00Z",
    type: "Group",
    location: "Spin Studio"
  },
  {
    id: "class5",
    name: "Core Crusher",
    description: "30-minute focused workout for developing core strength and stability.",
    trainerId: "trainer3",
    capacity: 15,
    enrolled: 10,
    startTime: "2023-07-21T12:00:00Z",
    endTime: "2023-07-21T12:30:00Z",
    type: "Group",
    location: "Studio A"
  }
];

// Mock Memberships
export const mockMemberships: Membership[] = [
  {
    id: "membership1",
    name: "Premium Annual",
    price: 999,
    durationDays: 365,
    benefits: [
      "Unlimited gym access",
      "Free group classes",
      "2 personal training sessions/month",
      "Locker rental",
      "Spa access"
    ],
    active: true
  },
  {
    id: "membership2",
    name: "Standard Monthly",
    price: 99,
    durationDays: 30,
    benefits: [
      "Unlimited gym access",
      "5 group classes/month",
      "Fitness assessment"
    ],
    active: true
  },
  {
    id: "membership3",
    name: "Basic Quarterly",
    price: 249,
    durationDays: 90,
    benefits: [
      "Unlimited gym access",
      "3 group classes/month"
    ],
    active: true
  },
  {
    id: "membership4",
    name: "Student Special",
    price: 69,
    durationDays: 30,
    benefits: [
      "Unlimited gym access",
      "2 group classes/month",
      "Valid student ID required"
    ],
    active: true
  },
  {
    id: "membership5",
    name: "Family Plan",
    price: 199,
    durationDays: 30,
    benefits: [
      "Access for up to 4 family members",
      "10 group classes to share/month",
      "Childcare services"
    ],
    active: true
  }
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "announcement1",
    title: "New Yoga Class Schedule",
    content: "We're excited to announce our expanded yoga schedule with 5 new classes per week!",
    createdBy: "admin1",
    createdAt: "2023-07-15T10:00:00Z",
    targetRoles: ["member", "trainer", "staff", "admin"],
    expiresAt: "2023-07-30T23:59:59Z"
  },
  {
    id: "announcement2",
    title: "Maintenance Notice",
    content: "The pool area will be closed for maintenance from July 25-27. We apologize for any inconvenience.",
    createdBy: "admin1",
    createdAt: "2023-07-18T15:30:00Z",
    targetRoles: ["member", "trainer", "staff", "admin"],
    expiresAt: "2023-07-28T23:59:59Z"
  },
  {
    id: "announcement3",
    title: "Staff Meeting",
    content: "Reminder: Monthly staff meeting this Friday at 2 PM in the conference room.",
    createdBy: "admin1",
    createdAt: "2023-07-19T09:00:00Z",
    targetRoles: ["trainer", "staff", "admin"],
    expiresAt: "2023-07-21T23:59:59Z"
  }
];

// Mock Dashboard Summary
export const mockDashboardSummary: DashboardSummary = {
  totalMembers: 243,
  todayCheckIns: 87,
  revenue: {
    daily: 1250,
    weekly: 8750,
    monthly: 35000
  },
  pendingPayments: {
    count: 12,
    total: 1490
  },
  upcomingRenewals: 8,
  attendanceTrend: [
    { date: "2023-07-14", count: 78 },
    { date: "2023-07-15", count: 82 },
    { date: "2023-07-16", count: 65 },
    { date: "2023-07-17", count: 91 },
    { date: "2023-07-18", count: 85 },
    { date: "2023-07-19", count: 93 },
    { date: "2023-07-20", count: 87 }
  ],
  membersByStatus: {
    active: 205,
    inactive: 18,
    expired: 20
  },
  recentNotifications: [
    {
      id: "notif1",
      userId: "admin1",
      title: "Payment Received",
      message: "John Doe has completed payment for Premium Annual membership.",
      type: "payment",
      read: false,
      createdAt: "2023-07-20T09:45:00Z"
    },
    {
      id: "notif2",
      userId: "admin1",
      title: "New Member Registration",
      message: "Sarah Parker has registered as a new member.",
      type: "system",
      read: true,
      createdAt: "2023-07-19T14:30:00Z"
    },
    {
      id: "notif3",
      userId: "admin1",
      title: "Low Inventory Alert",
      message: "Protein powder (Chocolate) is below reorder level.",
      type: "system",
      read: false,
      createdAt: "2023-07-19T08:15:00Z"
    }
  ]
};
