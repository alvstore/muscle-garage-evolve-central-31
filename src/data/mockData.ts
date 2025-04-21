import {
  CreditCard,
  BarChart3,
  Settings,
  User,
  CalendarDays,
  Dumbbell,
  UserCircle,
  Briefcase,
  Clock,
  PieChart,
  Building2,
  Contact,
  Mail,
  MessageCircle,
  Share2,
  HelpCircle,
  Radio,
  Globe,
  Bell,
  Activity,
  Cpu,
  Package,
  Store,
  FileText,
  Megaphone,
  RefreshCcw,
  TrendingUp,
  UserPlus,
  FolderHeart,
  Gift,
  Wallet,
  Archive,
  DollarSign,
  Receipt
} from "lucide-react";
import { Announcement, UserRole } from "@/types";

export const mockDashboardSummary = {
  totalMembers: 350,
  todayCheckIns: 78,
  revenue: {
    daily: 1250,
    weekly: 8750,
    monthly: 35000,
  },
  pendingPayments: {
    count: 12,
    total: 750,
  },
  upcomingRenewals: 25,
  attendanceTrend: [
    { date: "2023-07-01", count: 65 },
    { date: "2023-07-02", count: 72 },
    { date: "2023-07-03", count: 78 },
    { date: "2023-07-04", count: 69 },
    { date: "2023-07-05", count: 75 },
  ],
  membersByStatus: {
    active: 300,
    inactive: 30,
    expired: 20,
  },
  recentNotifications: [
    {
      id: "notif-1",
      userId: "user-1",
      title: "Membership Renewal",
      message: "Your membership is expiring soon. Renew now!",
      type: "renewal",
      read: false,
      createdAt: "2023-07-05T14:30:00Z",
    },
    {
      id: "notif-2",
      userId: "user-2",
      title: "New Class Alert",
      message: "A new Zumba class has been added to the schedule.",
      type: "announcement",
      read: true,
      createdAt: "2023-07-04T10:00:00Z",
    },
  ],
};

export const mockMembers = [
  {
    id: "member-1",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "member" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    goal: "Lose weight and build muscle",
    trainerId: "trainer-1",
    membershipId: "membership-1",
    membershipStatus: "active",
    membershipStartDate: "2023-01-01",
    membershipEndDate: "2023-12-31",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "91234",
    country: "USA",
  },
  {
    id: "member-2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "member" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 987-6543",
    dateOfBirth: "1988-11-20",
    goal: "Improve cardiovascular health",
    trainerId: "trainer-2",
    membershipId: "membership-2",
    membershipStatus: "inactive",
    membershipStartDate: "2022-12-01",
    membershipEndDate: "2023-11-30",
    address: "456 Oak Ave",
    city: "Springfield",
    state: "IL",
    zipCode: "62704",
    country: "USA",
  },
  {
    id: "member-3",
    email: "alice.johnson@example.com",
    name: "Alice Johnson",
    role: "member" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 246-8013",
    dateOfBirth: "1992-07-08",
    goal: "Increase strength and endurance",
    trainerId: "trainer-1",
    membershipId: "membership-3",
    membershipStatus: "active",
    membershipStartDate: "2023-02-15",
    membershipEndDate: "2024-02-14",
    address: "789 Pine Ln",
    city: "Hill Valley",
    state: "WA",
    zipCode: "98052",
    country: "USA",
  },
  {
    id: "member-4",
    email: "bob.williams@example.com",
    name: "Bob Williams",
    role: "member" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 135-7924",
    dateOfBirth: "1985-03-25",
    goal: "Maintain fitness and flexibility",
    trainerId: "trainer-3",
    membershipId: "membership-1",
    membershipStatus: "expired",
    membershipStartDate: "2022-11-10",
    membershipEndDate: "2023-11-09",
    address: "321 Elm Rd",
    city: "Gotham",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
  {
    id: "member-5",
    email: "carol.davis@example.com",
    name: "Carol Davis",
    role: "member" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 864-2075",
    dateOfBirth: "1995-09-01",
    goal: "Tone muscles and improve posture",
    trainerId: "trainer-2",
    membershipId: "membership-2",
    membershipStatus: "active",
    membershipStartDate: "2023-03-01",
    membershipEndDate: "2024-02-29",
    address: "654 Maple Dr",
    city: "Metropolis",
    state: "GA",
    zipCode: "30303",
    country: "USA",
  },
];

export const mockTrainers = [
  {
    id: "trainer-1",
    email: "trainer1@example.com",
    name: "Alex Johnson",
    role: "trainer" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 111-2222",
    specialty: "Strength Training",
    bio: "Certified personal trainer with 5 years of experience.",
    scheduleId: "schedule-1",
    rating: 4.8,
  },
  {
    id: "trainer-2",
    email: "trainer2@example.com",
    name: "Megan Lee",
    role: "trainer" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 333-4444",
    specialty: "Yoga and Pilates",
    bio: "Experienced yoga and Pilates instructor.",
    scheduleId: "schedule-2",
    rating: 4.9,
  },
  {
    id: "trainer-3",
    email: "trainer3@example.com",
    name: "Carlos Rodriguez",
    role: "trainer" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 555-6666",
    specialty: "Cardio and Endurance",
    bio: "Specializes in cardio and endurance training programs.",
    scheduleId: "schedule-3",
    rating: 4.7,
  },
];

export const mockStaff = [
  {
    id: "staff-1",
    email: "staff1@example.com",
    name: "Emily White",
    role: "staff" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 777-8888",
    position: "Receptionist",
    department: "Front Desk",
  },
  {
    id: "staff-2",
    email: "staff2@example.com",
    name: "David Green",
    role: "staff" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 999-0000",
    position: "Manager",
    department: "Management",
  },
];

export const mockAdmins = [
  {
    id: "admin-1",
    email: "admin1@example.com",
    name: "Admin User",
    role: "admin" as UserRole,
    avatar: "https://via.placeholder.com/150",
    phone: "+1 (555) 123-0000",
  },
];

export const mockClasses = [
  {
    id: "class-1",
    name: "Yoga for Beginners",
    description: "A gentle introduction to yoga.",
    trainerId: "trainer-2",
    capacity: 15,
    enrolled: 10,
    startTime: "2023-07-10T09:00:00Z",
    endTime: "2023-07-10T10:00:00Z",
    type: "Yoga",
    location: "Studio A",
  },
  {
    id: "class-2",
    name: "Advanced Strength Training",
    description: "High-intensity strength training class.",
    trainerId: "trainer-1",
    capacity: 10,
    enrolled: 8,
    startTime: "2023-07-11T17:00:00Z",
    endTime: "2023-07-11T18:00:00Z",
    type: "Strength Training",
    location: "Weight Room",
  },
  {
    id: "class-3",
    name: "Cardio Blast",
    description: "High-energy cardio workout.",
    trainerId: "trainer-3",
    capacity: 20,
    enrolled: 15,
    startTime: "2023-07-12T18:30:00Z",
    endTime: "2023-07-12T19:30:00Z",
    type: "Cardio",
    location: "Main Gym",
  },
];

export const mockMemberships = [
  {
    id: "membership-1",
    name: "Basic",
    price: 50,
    durationDays: 30,
    benefits: ["Gym access"],
    active: true,
  },
  {
    id: "membership-2",
    name: "Standard",
    price: 80,
    durationDays: 30,
    benefits: ["Gym access", "Group classes"],
    active: true,
  },
  {
    id: "membership-3",
    name: "Premium",
    price: 120,
    durationDays: 30,
    benefits: ["Gym access", "Group classes", "Personal training"],
    active: true,
  },
];

export const mockAttendance = [
  {
    id: "attendance-1",
    memberId: "member-1",
    checkInTime: "2023-07-05T08:00:00Z",
    checkOutTime: "2023-07-05T09:30:00Z",
    accessMethod: "rfid",
  },
  {
    id: "attendance-2",
    memberId: "member-2",
    checkInTime: "2023-07-05T17:00:00Z",
    checkOutTime: "2023-07-05T18:45:00Z",
    accessMethod: "fingerprint",
  },
];

export const mockDietPlans = [
  {
    id: "diet-1",
    memberId: "member-1",
    trainerId: "trainer-1",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-07-01T00:00:00Z",
    mealPlans: [
      {
        id: "meal-1",
        name: "Breakfast",
        time: "08:00",
        items: ["Oatmeal", "Berries", "Nuts"],
        macros: { protein: 15, carbs: 40, fats: 10 },
      },
      {
        id: "meal-2",
        name: "Lunch",
        time: "12:00",
        items: ["Chicken Salad", "Whole Wheat Bread", "Avocado"],
        macros: { protein: 30, carbs: 35, fats: 20 },
      },
    ],
  },
  {
    id: "diet-2",
    memberId: "member-2",
    trainerId: "trainer-2",
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2023-07-04T00:00:00Z",
    mealPlans: [
      {
        id: "meal-3",
        name: "Breakfast",
        time: "07:30",
        items: ["Smoothie", "Spinach", "Banana", "Protein Powder"],
        macros: { protein: 25, carbs: 30, fats: 5 },
      },
      {
        id: "meal-4",
        name: "Dinner",
        time: "19:00",
        items: ["Salmon", "Quinoa", "Steamed Vegetables"],
        macros: { protein: 35, carbs: 25, fats: 25 },
      },
    ],
  },
];

export const mockWorkoutPlans = [
  {
    id: "workout-1",
    memberId: "member-1",
    trainerId: "trainer-1",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-07-01T00:00:00Z",
    workoutDays: [
      {
        id: "day-1",
        name: "Monday",
        exercises: [
          {
            id: "ex-1",
            name: "Bench Press",
            sets: 3,
            reps: 8,
            weight: 100,
            rest: 60,
          },
          {
            id: "ex-2",
            name: "Squats",
            sets: 3,
            reps: 8,
            weight: 120,
            rest: 60,
          },
        ],
      },
      {
        id: "day-2",
        name: "Wednesday",
        exercises: [
          {
            id: "ex-3",
            name: "Deadlifts",
            sets: 1,
            reps: 5,
            weight: 140,
            rest: 90,
          },
          {
            id: "ex-4",
            name: "Overhead Press",
            sets: 3,
            reps: 8,
            weight: 60,
            rest: 60,
          },
        ],
      },
    ],
  },
  {
    id: "workout-2",
    memberId: "member-2",
    trainerId: "trainer-2",
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2023-07-04T00:00:00Z",
    workoutDays: [
      {
        id: "day-3",
        name: "Tuesday",
        exercises: [
          {
            id: "ex-5",
            name: "Yoga Flow",
            sets: 1,
            reps: 1,
            rest: 0,
          },
          {
            id: "ex-6",
            name: "Pilates Core",
            sets: 3,
            reps: 12,
            rest: 45,
          },
        ],
      },
      {
        id: "day-4",
        name: "Thursday",
        exercises: [
          {
            id: "ex-7",
            name: "Cardio Run",
            sets: 1,
            reps: 1,
            rest: 0,
          },
          {
            id: "ex-8",
            name: "Swimming",
            sets: 1,
            reps: 1,
            rest: 0,
          },
        ],
      },
    ],
  },
];

export const mockProgressRecords = [
  {
    id: "progress-1",
    memberId: "member-1",
    date: "2023-07-01",
    weight: 80,
    bodyFatPercentage: 20,
    measurements: {
      chest: 100,
      waist: 80,
      hips: 100,
      arms: 30,
      thighs: 50,
    },
    photos: ["https://via.placeholder.com/150"],
    notes: "Good progress this month!",
  },
  {
    id: "progress-2",
    memberId: "member-2",
    date: "2023-07-01",
    weight: 65,
    bodyFatPercentage: 25,
    measurements: {
      chest: 85,
      waist: 70,
      hips: 90,
      arms: 25,
      thighs: 45,
    },
    photos: ["https://via.placeholder.com/150"],
    notes: "Focus on diet this month.",
  },
];

export const mockInventory = [
  {
    id: "inv-1",
    name: "Protein Powder",
    category: "supplement",
    quantity: 50,
    price: 40,
    supplier: "Supplier A",
    expiryDate: "2024-01-01",
    reorderLevel: 10,
  },
  {
    id: "inv-2",
    name: "Dumbbells",
    category: "equipment",
    quantity: 20,
    price: 30,
    supplier: "Supplier B",
    reorderLevel: 5,
  },
  {
    id: "inv-3",
    name: "T-Shirt",
    category: "merchandise",
    quantity: 100,
    price: 20,
    supplier: "Supplier C",
    reorderLevel: 20,
  },
];

export const mockTransactions = [
  {
    id: "trans-1",
    type: "income",
    amount: 50,
    date: "2023-07-05",
    category: "Membership",
    description: "Membership payment",
    recurring: false,
  },
  {
    id: "trans-2",
    type: "expense",
    amount: 200,
    date: "2023-07-04",
    category: "Rent",
    description: "Monthly rent",
    recurring: true,
    recurringPeriod: "monthly",
  },
];

export const mockInvoices = [
  {
    id: "invoice-1",
    memberId: "member-1",
    amount: 50,
    status: "paid",
    dueDate: "2023-07-05",
    issuedDate: "2023-07-01",
    items: [
      {
        name: "Membership",
        quantity: 1,
        unitPrice: 50,
      },
    ],
  },
  {
    id: "invoice-2",
    memberId: "member-2",
    amount: 80,
    status: "pending",
    dueDate: "2023-07-10",
    issuedDate: "2023-07-01",
    items: [
      {
        name: "Membership",
        quantity: 1,
        unitPrice: 80,
      },
    ],
  },
];

export const mockLeads = [
  {
    id: "lead-1",
    name: "Lead One",
    email: "lead1@example.com",
    phone: "+1 (555) 111-1111",
    source: "Website",
    status: "new",
    assignedTo: "staff-1",
    notes: "Interested in premium membership",
    createdAt: "2023-07-01",
    updatedAt: "2023-07-05",
    followUpDate: "2023-07-08",
  },
  {
    id: "lead-2",
    name: "Lead Two",
    email: "lead2@example.com",
    phone: "+1 (555) 222-2222",
    source: "Referral",
    status: "contacted",
    assignedTo: "staff-2",
    notes: "Asked for more information",
    createdAt: "2023-07-02",
    updatedAt: "2023-07-05",
    followUpDate: "2023-07-09",
  },
];

// Update the announcements in the mock data to include the required authorId and authorName fields
export const mockAnnouncements = [
  {
    id: "ann-1",
    title: "Important Gym Closure",
    content: "The gym will be closed on July 10th for maintenance. We apologize for the inconvenience.",
    createdBy: "admin-1",
    authorId: "admin-1", // Add this required field
    authorName: "Admin User", // Add this required field
    createdAt: "2023-07-01T10:00:00Z",
    targetRoles: ["admin", "staff", "trainer", "member"] as UserRole[],
    expiresAt: "2023-07-11T10:00:00Z",
    priority: "high" as "high", // Use a proper union type value
    sentCount: 150
  },
  {
    id: "ann-2",
    title: "New Fitness Classes",
    content: "We're excited to announce our new Yoga and Pilates classes starting next week!",
    createdBy: "admin-2",
    authorId: "admin-2", // Add this required field
    authorName: "Admin Manager", // Add this required field
    createdAt: "2023-07-02T14:30:00Z",
    targetRoles: ["admin", "staff", "trainer", "member"] as UserRole[],
    expiresAt: "2023-07-15T14:30:00Z",
    priority: "medium" as "medium", // Use a proper union type value
    sentCount: 120
  },
  {
    id: "ann-3",
    title: "Staff Meeting Reminder",
    content: "Reminder: There will be a staff meeting on July 5th at 10:00 AM.",
    createdBy: "admin-1",
    authorId: "admin-1", // Add this required field
    authorName: "Admin User", // Add this required field
    createdAt: "2023-07-03T09:15:00Z",
    targetRoles: ["admin", "staff", "trainer"] as UserRole[],
    expiresAt: "2023-07-05T10:00:00Z",
    priority: "low" as "low", // Use a proper union type value
    sentCount: 25
  }
];
