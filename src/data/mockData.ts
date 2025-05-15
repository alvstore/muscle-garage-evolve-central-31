
// Need to import the correct types
import {
  Member,
  Trainer,
  Staff,
  Admin,
  Class,
  Membership
} from '@/types/membership';

// Add mockUsers for OTPForm
export const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin"
  },
  {
    id: "2",
    email: "staff@example.com",
    name: "Staff User",
    role: "staff"
  },
  {
    id: "3",
    email: "trainer@example.com",
    name: "Trainer User",
    role: "trainer"
  },
  {
    id: "4",
    email: "member@example.com",
    name: "Member User",
    role: "member"
  }
];

// Update mock data to use the correct property names
export const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+91 9876543210",
    gender: "male",
    address: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zipCode: "400001",
    membership_status: "active",
    membership_start_date: "2024-01-01",
    membership_end_date: "2024-12-31",
    status: "active",
    avatar: "/testimonial-1.png",
    goal: "Weight loss",
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily@example.com",
    phone: "+1 5551234567",
    gender: "female",
    address: "456 Oak Ave",
    city: "New York",
    state: "NY",
    country: "USA",
    zipCode: "10001",
    membership_status: "inactive",
    membership_start_date: "2023-05-01",
    membership_end_date: "2023-12-31",
    status: "inactive",
    avatar: "/testimonial-2.jpg",
    goal: "Muscle gain",
  },
  {
    id: "3",
    name: "Ricardo Gomez",
    email: "ricardo@example.com",
    phone: "+52 5556789012",
    gender: "male",
    address: "789 Pine Ln",
    city: "Mexico City",
    state: "CDMX",
    country: "Mexico",
    zipCode: "11560",
    membership_status: "active",
    membership_start_date: "2024-02-15",
    membership_end_date: "2025-02-14",
    status: "active",
    avatar: "/testimonial-3.jpg",
    goal: "Endurance training",
  },
  {
    id: "4",
    name: "Aisha Khan",
    email: "aisha@example.com",
    phone: "+92 5552345678",
    gender: "female",
    address: "101 Elm Rd",
    city: "Karachi",
    state: "Sindh",
    country: "Pakistan",
    zipCode: "75600",
    membership_status: "active",
    membership_start_date: "2024-03-01",
    membership_end_date: "2025-02-28",
    status: "active",
    avatar: "/testimonial-4.jpg",
    goal: "Flexibility",
  },
  {
    id: "5",
    name: "Kenji Tanaka",
    email: "kenji@example.com",
    phone: "+81 5553456789",
    gender: "male",
    address: "112 Cherry Blvd",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    zipCode: "100-0001",
    membership_status: "inactive",
    membership_start_date: "2023-04-01",
    membership_end_date: "2023-12-31",
    status: "inactive",
    avatar: "/testimonial-5.jpg",
    goal: "Overall fitness",
  },
];

// Update trainers to use the correct property names
export const mockTrainers: Trainer[] = [
  {
    id: "1",
    name: "Alex Trainer",
    email: "alex@example.com",
    phone: "+91 9876543201",
    bio: "Certified personal trainer with 5 years experience.",
    avatar: "/trainer-1.jpg",
    specialty: "Weight Training",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 9876543202",
    bio: "Yoga instructor with 8 years of experience.",
    avatar: "/trainer-2.jpg",
    specialty: "Yoga",
  },
  {
    id: "3",
    name: "David Lee",
    email: "david@example.com",
    phone: "+1 5559876543",
    bio: "Cardio and endurance specialist.",
    avatar: "/trainer-3.jpg",
    specialty: "Cardio",
  },
];

// Update staff to use the correct property names
export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Sarah Manager",
    email: "sarah@example.com",
    phone: "+91 9876543202",
    department: "Management",
    avatar: "/testimonial-2.jpg",
  },
  {
    id: "2",
    name: "Raj Patel",
    email: "raj@example.com",
    phone: "+91 9876543203",
    department: "Reception",
    avatar: "/testimonial-3.jpg",
  },
];

// Update admin to use the correct property names
export const mockAdmins: Admin[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
  }
];

// Update classes to use the correct property names
export const mockClasses: Class[] = [
  {
    id: "1",
    name: "Morning Yoga",
    type: "yoga",
    description: "Start your day with energizing yoga poses",
    trainer_id: "1", // Changed from trainerId to trainer_id
    trainer: "Alex Trainer",
    location: "Studio A",
    capacity: 15,
    start_time: "2023-06-15T07:00:00Z",
    end_time: "2023-06-15T08:00:00Z",
    recurring: true,
    recurrence: "daily",
    level: "all",
    difficulty: "beginner",
    enrolled: 8,
    is_active: true,
    status: "active"
  },
  {
    id: "2",
    name: "Cardio Blast",
    type: "cardio",
    description: "High-intensity cardio workout to burn calories",
    trainer_id: "3", // Changed from trainerId to trainer_id
    trainer: "David Lee",
    location: "Gym Floor",
    capacity: 20,
    start_time: "2023-06-16T17:00:00Z",
    end_time: "2023-06-16T18:00:00Z",
    recurring: true,
    recurrence: "weekly",
    level: "intermediate",
    difficulty: "moderate",
    enrolled: 12,
    is_active: true,
    status: "active"
  },
  {
    id: "3",
    name: "Strength Training",
    type: "strength",
    description: "Build muscle and increase strength",
    trainer_id: "1", // Changed from trainerId to trainer_id
    trainer: "Alex Trainer",
    location: "Weight Room",
    capacity: 10,
    start_time: "2023-06-17T10:00:00Z",
    end_time: "2023-06-17T11:00:00Z",
    recurring: false,
    recurrence: "none",
    level: "advanced",
    difficulty: "hard",
    enrolled: 7,
    is_active: true,
    status: "active"
  },
  {
    id: "4",
    name: "Pilates Fusion",
    type: "pilates",
    description: "Core strengthening and flexibility workout",
    trainer_id: "2", // Changed from trainerId to trainer_id
    trainer: "Priya Sharma",
    location: "Studio B",
    capacity: 12,
    start_time: "2023-06-18T14:00:00Z",
    end_time: "2023-06-18T15:00:00Z",
    recurring: true,
    recurrence: "weekly",
    level: "all",
    difficulty: "beginner",
    enrolled: 10,
    is_active: true,
    status: "active"
  },
  {
    id: "5",
    name: "HIIT Express",
    type: "hiit",
    description: "30-minute high-intensity interval training",
    trainer_id: "3", // Changed from trainerId to trainer_id
    trainer: "David Lee",
    location: "Gym Floor",
    capacity: 25,
    start_time: "2023-06-19T12:00:00Z",
    end_time: "2023-06-19T12:30:00Z",
    recurring: true,
    recurrence: "daily",
    level: "intermediate",
    difficulty: "moderate",
    enrolled: 18,
    is_active: true,
    status: "active"
  },
];

// Update memberships to use the correct property names
export const mockMemberships: Membership[] = [
  {
    id: "1",
    name: "Basic",
    description: "Access to gym during regular hours",
    price: 1500,
    duration_days: 30, // Changed from duration to duration_days
    features: [
      "Gym access",
      "Locker use"
    ],
    is_active: true,
    status: "active"
  },
  {
    id: "2",
    name: "Premium",
    description: "Unlimited access to all facilities and classes",
    price: 2500,
    duration_days: 90, // Changed from duration to duration_days
    features: [
      "Unlimited gym access",
      "Access to all classes",
      "Personal training sessions",
      "Nutrition consultation"
    ],
    is_active: true,
    status: "active"
  },
  {
    id: "3",
    name: "Gold",
    description: "Access to gym and group fitness classes",
    price: 2000,
    duration_days: 60, // Changed from duration to duration_days
    features: [
      "Gym access",
      "Group fitness classes",
      "Sauna and steam room"
    ],
    is_active: true,
    status: "active"
  },
  {
    id: "4",
    name: "Trial",
    description: "7-day free trial with limited access",
    price: 0,
    duration_days: 7, // Changed from duration to duration_days
    features: [
      "Limited gym access",
      "One group fitness class"
    ],
    is_active: true,
    status: "active"
  },
];
