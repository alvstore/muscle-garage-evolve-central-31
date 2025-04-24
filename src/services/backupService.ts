import { faker } from '@faker-js/faker';
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const numberOfMembers = 50;
const numberOfTrainers = 10;
const numberOfStaff = 5;
const numberOfBranches = 3;

export const seedDatabase = async () => {
  try {
    // Generate Branch Data
    const branchData = Array.from({ length: numberOfBranches }, () => ({
      id: uuidv4(),
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      is_active: true,
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }));

    // Insert Branch Data
    const { error: branchError } = await supabase
      .from('branches')
      .upsert(branchData);

    if (branchError) throw branchError;
    console.log('Branches seeded successfully');

    // Generate Member Data
    const memberData = Array.from({ length: numberOfMembers }, () => ({
      id: uuidv4(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      date_of_birth: faker.date.birthdate().toISOString(),
      gender: faker.person.sex(),
      membership_start_date: faker.date.past().toISOString(),
      membership_end_date: faker.date.future().toISOString(),
      membership_plan_id: uuidv4(), // Placeholder
      status: 'active',
      branch_id: faker.helpers.arrayElement(branchData).id,
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }));

    // Insert Member Data
    const { error: memberError } = await supabase
      .from('members')
      .upsert(memberData);

    if (memberError) throw memberError;
    console.log('Members seeded successfully');

    // Generate Trainer Data
    const trainerData = Array.from({ length: numberOfTrainers }, () => ({
      id: uuidv4(),
      full_name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      date_of_birth: faker.date.birthdate().toISOString(),
      gender: faker.person.sex(),
      specialty: faker.person.jobType(),
      bio: faker.lorem.paragraph(),
      rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      is_active: true,
      branch_id: faker.helpers.arrayElement(branchData).id,
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
      role: 'trainer',
    }));

    // Generate Staff Data
    const staffData = Array.from({ length: numberOfStaff }, () => ({
      id: uuidv4(),
      full_name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      date_of_birth: faker.date.birthdate().toISOString(),
      gender: faker.person.sex(),
      department: faker.person.jobArea(),
      position: faker.person.jobTitle(),
      is_active: true,
      branch_id: faker.helpers.arrayElement(branchData).id,
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
      role: 'staff',
    }));

    // Generate User Data (Profiles)
    const userData = [
      ...trainerData.map(trainer => ({
        ...trainer,
        role: 'trainer',
      })),
      ...staffData.map(staff => ({
        ...staff,
        role: 'staff',
      })),
      {
        id: uuidv4(),
        full_name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        branch_id: faker.helpers.arrayElement(branchData).id,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
      }
    ];

    // Insert User Data (Profiles)
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(userData.map(user => ({
        id: uuidv4(), // Generate an ID for each user
        ...user,
      })) as any);

    if (upsertError) throw upsertError;
    console.log('Users seeded successfully');

    // Insert Trainer Data
    const { error: staffError } = await supabase
      .from('profiles')
      .upsert(staffData.map(staff => ({
        id: uuidv4(), // Generate an ID for each staff
        ...staff,
      })) as any);

    if (staffError) throw staffError;
    console.log('Staff seeded successfully');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed', error);
  }
};

export const getBackupLogs = async () => {
  return [];
};

export const exportData = async () => {
  return {};
};

export const validateImportData = (data: any) => {
  return true;
};

export const importData = async (data: any) => {
  return {};
};
