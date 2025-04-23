
import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create some sample branches
  const mainBranch = await prisma.branch.create({
    data: {
      name: 'Main Branch',
      address: '123 Fitness Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      email: 'main@musclegarage.com',
      phone: '+919876543210'
    }
  });

  const secondBranch = await prisma.branch.create({
    data: {
      name: 'Second Branch',
      address: '456 Gym Avenue',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      email: 'delhi@musclegarage.com',
      phone: '+919876543211'
    }
  });

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@musclegarage.com',
      password: adminPassword,
      name: 'Alex Johnson',
      role: UserRole.ADMIN,
      avatar: '/placeholder.svg',
      phone: '+1234567890',
      branchId: mainBranch.id,
      profile: {
        create: {
          isBranchManager: true
        }
      },
      admin: {
        create: {
          superAdmin: true
        }
      }
    }
  });

  // Create staff user
  const staffPassword = await hash('staff123', 10);
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@musclegarage.com',
      password: staffPassword,
      name: 'Taylor Smith',
      role: UserRole.STAFF,
      avatar: '/placeholder.svg',
      phone: '+1234567891',
      branchId: mainBranch.id,
      profile: {
        create: {}
      },
      staff: {
        create: {
          position: 'Front Desk',
          department: 'Operations'
        }
      }
    }
  });

  // Create trainer user
  const trainerPassword = await hash('trainer123', 10);
  const trainerUser = await prisma.user.create({
    data: {
      email: 'trainer@musclegarage.com',
      password: trainerPassword,
      name: 'Chris Rodriguez',
      role: UserRole.TRAINER,
      avatar: '/placeholder.svg',
      phone: '+1234567892',
      branchId: mainBranch.id,
      profile: {
        create: {}
      },
      trainer: {
        create: {
          specialty: 'Weight Loss',
          bio: 'Certified personal trainer with 8 years of experience specializing in weight management and functional training.',
          rating: 4.8
        }
      }
    }
  });

  // Create member user
  const memberPassword = await hash('member123', 10);
  const memberUser = await prisma.user.create({
    data: {
      email: 'member@example.com',
      password: memberPassword,
      name: 'Jordan Lee',
      role: UserRole.MEMBER,
      avatar: '/placeholder.svg',
      phone: '+1234567893',
      branchId: mainBranch.id,
      profile: {
        create: {
          address: '789 Fitness Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          dateOfBirth: new Date('1990-05-15')
        }
      }
    }
  });

  // Create a member profile
  const memberProfile = await prisma.member.create({
    data: {
      userId: memberUser.id,
      branchId: mainBranch.id,
      goal: 'Weight loss and muscle toning',
      trainerId: trainerUser.id,
      membershipStatus: 'ACTIVE',
      membershipStartDate: new Date('2023-01-01'),
      membershipEndDate: new Date('2024-01-01')
    }
  });

  // Create membership plans
  const premiumMembership = await prisma.membershipPlan.create({
    data: {
      name: 'Premium Annual',
      description: 'All inclusive premium membership',
      price: 999,
      durationDays: 365,
      durationLabel: '12-month',
      benefits: ['Unlimited gym access', 'Free group classes', '2 personal training sessions/month', 'Locker rental', 'Spa access'],
      allowedClasses: 'all'
    }
  });
  
  const standardMembership = await prisma.membershipPlan.create({
    data: {
      name: 'Standard Monthly',
      price: 99,
      durationDays: 30,
      durationLabel: '1-month',
      benefits: ['Unlimited gym access', '5 group classes/month', 'Fitness assessment'],
      allowedClasses: 'group-only'
    }
  });

  // Assign membership to member
  const memberMembership = await prisma.memberMembership.create({
    data: {
      memberId: memberProfile.id,
      membershipId: premiumMembership.id,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      status: 'active',
      totalAmount: 999,
      amountPaid: 999,
      paymentStatus: 'PAID',
      branchId: mainBranch.id
    }
  });

  // Update member with current membership
  await prisma.member.update({
    where: { id: memberProfile.id },
    data: { 
      currentMembershipId: memberMembership.id
    }
  });

  // Create a class
  const gymClass = await prisma.class.create({
    data: {
      name: 'HIIT Extreme',
      description: 'High-intensity interval training to maximize calorie burn and improve conditioning.',
      trainerId: trainerUser.id,
      capacity: 15,
      enrolled: 1,
      startTime: new Date('2023-07-20T08:00:00Z'),
      endTime: new Date('2023-07-20T09:00:00Z'),
      type: 'Group',
      location: 'Studio A',
      branchId: mainBranch.id
    }
  });

  // Create class booking
  const booking = await prisma.classBooking.create({
    data: {
      classId: gymClass.id,
      memberId: memberProfile.id,
      status: 'CONFIRMED',
      bookingDate: new Date()
    }
  });

  // Create workout plan
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      name: 'Weight Loss Program',
      description: 'A comprehensive program designed for weight loss',
      trainerId: trainerUser.id,
      difficulty: 'intermediate',
      isGlobal: true,
      isCustom: false,
      workoutDays: {
        create: [
          {
            name: 'Day 1 - Upper Body',
            dayLabel: 'Monday',
            exercises: {
              create: [
                {
                  name: 'Push-ups',
                  sets: 3,
                  reps: 12,
                  notes: 'Focus on form'
                },
                {
                  name: 'Dumbbell Rows',
                  sets: 3,
                  reps: 10,
                  weight: 15
                }
              ]
            }
          },
          {
            name: 'Day 2 - Lower Body',
            dayLabel: 'Wednesday',
            exercises: {
              create: [
                {
                  name: 'Squats',
                  sets: 4,
                  reps: 15
                },
                {
                  name: 'Lunges',
                  sets: 3,
                  reps: 10
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Assign workout plan to member
  await prisma.workoutAssignment.create({
    data: {
      planId: workoutPlan.id,
      memberId: memberProfile.id,
      trainerId: trainerUser.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  });

  // Create diet plan
  const dietPlan = await prisma.dietPlan.create({
    data: {
      name: 'Balanced Nutrition Plan',
      dietType: 'balanced',
      description: 'A balanced nutrition plan for general health',
      dailyCalories: 2000,
      proteinRatio: 0.3,
      carbsRatio: 0.4,
      fatRatio: 0.3,
      isGlobal: true,
      isCustom: false,
      trainerId: trainerUser.id,
      branchId: mainBranch.id,
      mealPlans: {
        create: [
          {
            name: 'Breakfast',
            time: '08:00 AM',
            mealItems: {
              create: [
                {
                  name: 'Oatmeal with fruits',
                  calories: 300,
                  protein: 10,
                  carbs: 45,
                  fats: 6
                }
              ]
            }
          },
          {
            name: 'Lunch',
            time: '01:00 PM',
            mealItems: {
              create: [
                {
                  name: 'Grilled chicken salad',
                  calories: 450,
                  protein: 35,
                  carbs: 20,
                  fats: 15
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Assign diet plan to member
  await prisma.dietAssignment.create({
    data: {
      dietPlanId: dietPlan.id,
      memberId: memberProfile.id,
      trainerId: trainerUser.id,
      startDate: new Date(),
      status: 'active'
    }
  });

  // Create global settings
  await prisma.globalSettings.create({
    data: {
      currency: 'INR',
      currencySymbol: '₹',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
