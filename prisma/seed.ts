
import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await clearDatabase()
  
  // Create branches
  const mainBranch = await prisma.branch.create({
    data: {
      name: 'Main Branch',
      address: '123 Fitness Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      email: 'main@fitnesshub.com',
      phone: '+91 9876543210',
    },
  })
  
  const secondBranch = await prisma.branch.create({
    data: {
      name: 'Downtown Branch',
      address: '456 Gym Street',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      email: 'downtown@fitnesshub.com',
      phone: '+91 9876543211',
    },
  })
  
  // Create admin
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fitnesshub.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      phone: '+91 9876543200',
    },
  })
  
  // Create staff users
  const staffPassword = await hash('staff123', 10)
  const staff1 = await prisma.user.create({
    data: {
      email: 'staff1@fitnesshub.com',
      name: 'Staff One',
      role: UserRole.STAFF,
      phone: '+91 9876543201',
      branchId: mainBranch.id,
      staffProfile: {
        create: {
          position: 'Front Desk',
          department: 'Operations',
        }
      }
    },
  })
  
  const staff2 = await prisma.user.create({
    data: {
      email: 'staff2@fitnesshub.com',
      name: 'Staff Two',
      role: UserRole.STAFF,
      phone: '+91 9876543202',
      branchId: secondBranch.id,
      staffProfile: {
        create: {
          position: 'Manager',
          department: 'Administration',
        }
      }
    },
  })
  
  // Create trainers
  const trainer1 = await prisma.user.create({
    data: {
      email: 'trainer1@fitnesshub.com',
      name: 'Trainer One',
      role: UserRole.TRAINER,
      phone: '+91 9876543203',
      branchId: mainBranch.id,
      trainerProfile: {
        create: {
          specialty: 'Weight Training',
          rating: 4.8,
          experience: 5,
          certifications: ['ACE Certified', 'NASM'],
        }
      }
    },
  })
  
  const trainer2 = await prisma.user.create({
    data: {
      email: 'trainer2@fitnesshub.com',
      name: 'Trainer Two',
      role: UserRole.TRAINER,
      phone: '+91 9876543204',
      branchId: secondBranch.id,
      trainerProfile: {
        create: {
          specialty: 'Yoga',
          rating: 4.7,
          experience: 3,
          certifications: ['RYT-200', 'Yoga Alliance'],
        }
      }
    },
  })
  
  // Create members
  const member1 = await prisma.user.create({
    data: {
      email: 'member1@example.com',
      name: 'Member One',
      role: UserRole.MEMBER,
      phone: '+91 9876543205',
      branchId: mainBranch.id,
      dateOfBirth: new Date('1990-05-15'),
      address: '789 Residential Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      memberProfile: {
        create: {
          goal: 'Weight Loss',
          membershipStatus: 'active',
        }
      }
    },
  })
  
  const member2 = await prisma.user.create({
    data: {
      email: 'member2@example.com',
      name: 'Member Two',
      role: UserRole.MEMBER,
      phone: '+91 9876543206',
      branchId: secondBranch.id,
      dateOfBirth: new Date('1985-10-20'),
      address: '101 Apartment Complex',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      memberProfile: {
        create: {
          goal: 'Muscle Gain',
          membershipStatus: 'active',
        }
      }
    },
  })
  
  // Create membership plans
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Basic Plan',
      description: 'Access to gym equipment only',
      price: 1999,
      durationDays: 30,
      durationLabel: '1-month',
      benefits: ['Gym Access', 'Locker Room Access'],
      allowedClasses: 'basic-only',
      features: { gym: true, pool: false, classes: false },
    },
  })
  
  const premiumPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Premium Plan',
      description: 'Full access to all facilities',
      price: 3999,
      durationDays: 30,
      durationLabel: '1-month',
      benefits: ['Gym Access', 'Pool Access', 'Group Classes', 'Locker Room Access'],
      allowedClasses: 'all',
      features: { gym: true, pool: true, classes: true },
    },
  })
  
  const annualPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Annual Plan',
      description: 'Full access for one year at discounted rate',
      price: 39999,
      durationDays: 365,
      durationLabel: '12-month',
      benefits: ['Gym Access', 'Pool Access', 'Group Classes', 'Locker Room Access', 'One Free PT Session Monthly'],
      allowedClasses: 'all',
      features: { gym: true, pool: true, classes: true },
    },
  })
  
  // Assign memberships to members
  const memberMembership1 = await prisma.memberMembership.create({
    data: {
      memberId: member1.id,
      membershipId: premiumPlan.id,
      branchId: mainBranch.id,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      totalAmount: premiumPlan.price,
      amountPaid: premiumPlan.price,
      paymentStatus: 'paid',
    },
  })
  
  const memberMembership2 = await prisma.memberMembership.create({
    data: {
      memberId: member2.id,
      membershipId: basicPlan.id,
      branchId: secondBranch.id,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      totalAmount: basicPlan.price,
      amountPaid: basicPlan.price,
      paymentStatus: 'paid',
    },
  })
  
  // Assign trainers to members
  const trainerAssignment1 = await prisma.trainerAssignment.create({
    data: {
      trainerId: trainer1.id,
      memberId: member1.id,
      branchId: mainBranch.id,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
      isActive: true,
    },
  })
  
  // Create classes
  const yogaClass = await prisma.gymClass.create({
    data: {
      name: 'Morning Yoga',
      description: 'Start your day with rejuvenating yoga',
      trainerId: trainer2.id,
      capacity: 15,
      startTime: new Date(new Date().setHours(7, 0, 0, 0)),
      endTime: new Date(new Date().setHours(8, 0, 0, 0)),
      type: 'yoga',
      difficulty: 'all',
      location: 'Yoga Studio',
      branchId: secondBranch.id,
      recurring: true,
      recurringPattern: 'weekly',
    },
  })
  
  const hiitClass = await prisma.gymClass.create({
    data: {
      name: 'HIIT Workout',
      description: 'High Intensity Interval Training',
      trainerId: trainer1.id,
      capacity: 10,
      startTime: new Date(new Date().setHours(18, 0, 0, 0)),
      endTime: new Date(new Date().setHours(19, 0, 0, 0)),
      type: 'hiit',
      difficulty: 'intermediate',
      location: 'Main Studio',
      branchId: mainBranch.id,
      recurring: true,
      recurringPattern: 'weekly',
    },
  })
  
  // Create bookings
  const booking1 = await prisma.classBooking.create({
    data: {
      classId: yogaClass.id,
      memberId: member2.id,
      status: 'confirmed',
    },
  })
  
  // Create workout plans
  const beginnerWorkout = await prisma.workoutPlan.create({
    data: {
      name: 'Beginner Full Body',
      description: 'Full body workout for beginners',
      trainerId: trainer1.id,
      memberId: member1.id,
      difficulty: 'beginner',
      isCustom: true,
      isGlobal: false,
      workoutDays: {
        create: [
          {
            name: 'Day 1 - Upper Body',
            dayLabel: 'Monday',
            exercises: {
              create: [
                {
                  name: 'Push Ups',
                  sets: 3,
                  reps: 10,
                  notes: 'Keep your core tight',
                  muscleGroupTag: 'chest',
                },
                {
                  name: 'Dumbbell Rows',
                  sets: 3,
                  reps: 12,
                  weight: 5,
                  muscleGroupTag: 'back',
                },
              ],
            },
          },
          {
            name: 'Day 2 - Lower Body',
            dayLabel: 'Wednesday',
            exercises: {
              create: [
                {
                  name: 'Bodyweight Squats',
                  sets: 3,
                  reps: 15,
                  notes: 'Keep your knees behind your toes',
                  muscleGroupTag: 'legs',
                },
                {
                  name: 'Lunges',
                  sets: 3,
                  reps: 10,
                  muscleGroupTag: 'legs',
                },
              ],
            },
          },
        ],
      },
    },
  })
  
  // Create diet plans
  const weightLossDiet = await prisma.dietPlan.create({
    data: {
      name: 'Weight Loss Diet',
      dietType: 'calorie deficit',
      description: 'Balanced diet for weight loss',
      trainerId: trainer1.id,
      memberId: member1.id,
      dailyCalories: 1800,
      proteinRatio: 0.3,
      carbsRatio: 0.4,
      fatRatio: 0.3,
      isCustom: true,
      isGlobal: false,
      mealPlans: {
        create: [
          {
            name: 'Breakfast',
            time: '08:00',
            mealItems: {
              create: [
                {
                  name: 'Oatmeal',
                  quantity: '1 cup',
                  calories: 150,
                  protein: 5,
                  carbs: 27,
                  fats: 2.5,
                },
                {
                  name: 'Banana',
                  quantity: '1 medium',
                  calories: 105,
                  protein: 1.3,
                  carbs: 27,
                  fats: 0.4,
                },
              ],
            },
          },
          {
            name: 'Lunch',
            time: '13:00',
            mealItems: {
              create: [
                {
                  name: 'Grilled Chicken Breast',
                  quantity: '150g',
                  calories: 240,
                  protein: 45,
                  carbs: 0,
                  fats: 5,
                },
                {
                  name: 'Brown Rice',
                  quantity: '1/2 cup',
                  calories: 108,
                  protein: 2.5,
                  carbs: 22.5,
                  fats: 0.9,
                },
                {
                  name: 'Mixed Vegetables',
                  quantity: '1 cup',
                  calories: 65,
                  protein: 2,
                  carbs: 13,
                  fats: 0.5,
                },
              ],
            },
          },
        ],
      },
    },
  })
  
  // Create body measurements
  const measurement1 = await prisma.bodyMeasurement.create({
    data: {
      memberId: member1.id,
      measurementDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      height: 175,
      weight: 80,
      bmi: 26.1,
      bodyFatPercentage: 22,
      chest: 95,
      waist: 85,
      hips: 100,
      recordedBy: trainer1.id,
    },
  })
  
  const measurement2 = await prisma.bodyMeasurement.create({
    data: {
      memberId: member1.id,
      measurementDate: new Date(),
      height: 175,
      weight: 78,
      bmi: 25.5,
      bodyFatPercentage: 21,
      chest: 94,
      waist: 83,
      hips: 99,
      recordedBy: trainer1.id,
    },
  })
  
  // Create payments
  const payment1 = await prisma.payment.create({
    data: {
      memberId: member1.id,
      amount: premiumPlan.price,
      status: 'completed',
      mode: 'card',
      membershipId: premiumPlan.id,
      paymentMethod: 'card',
      branchId: mainBranch.id,
      staffId: staff1.id,
    },
  })
  
  const payment2 = await prisma.payment.create({
    data: {
      memberId: member2.id,
      amount: basicPlan.price,
      status: 'completed',
      mode: 'cash',
      membershipId: basicPlan.id,
      paymentMethod: 'cash',
      branchId: secondBranch.id,
      staffId: staff2.id,
    },
  })
  
  // Create leads
  const lead1 = await prisma.lead.create({
    data: {
      name: 'Potential Member',
      email: 'potential@example.com',
      phone: '+91 9876543299',
      source: 'website',
      status: 'new',
      funnelStage: 'warm',
      interests: ['weight loss', 'yoga'],
      createdById: staff1.id,
      branchId: mainBranch.id,
    },
  })
  
  // Create global settings
  const settings = await prisma.globalSettings.create({
    data: {
      currency: 'INR',
      currencySymbol: '₹',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
    },
  })
  
  console.log('Database seeded successfully!')
}

async function clearDatabase() {
  // Delete all records in reverse order of dependencies
  const tablesToClear = [
    'bodyMeasurement',
    'exercise',
    'workoutDay',
    'workoutPlan',
    'mealItem',
    'mealPlan',
    'dietPlan',
    'classBooking',
    'gymClass',
    'trainerAssignment',
    'staffProfile',
    'trainerProfile',
    'memberProfile',
    'payment',
    'memberMembership',
    'lead',
    'globalSettings',
    'user',
    'membershipPlan',
    'branch',
  ]
  
  for (const table of tablesToClear) {
    try {
      // @ts-ignore - using dynamic table names
      await prisma[table].deleteMany({})
    } catch (error) {
      console.log(`Error clearing table ${table}:`, error)
    }
  }
  
  console.log('Database cleared!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
