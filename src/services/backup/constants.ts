
export const exportTypeToTable: Record<string, string> = {
  members: 'profiles',
  staff: 'profiles',
  trainers: 'profiles',
  branches: 'branches',
  workout_plans: 'workout_plans',
  diet_plans: 'diet_plans',
  attendance: 'member_attendance',
  invoices: 'payments',
  transactions: 'transactions',
  crm_leads: 'leads',
  referrals: 'referrals',
  tasks: 'tasks',
  inventory: 'inventory',
  store_orders: 'orders',
  website_content: 'website_content',
  settings: 'global_settings',
  all: 'all'
};

export const importTemplates = {
  members: [{
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'member'
  }],
  staff: [{
    full_name: 'Staff User',
    email: 'staff@example.com',
    phone: '1234567890',
    role: 'staff'
  }],
  trainers: [{
    full_name: 'Trainer User',
    email: 'trainer@example.com',
    phone: '1234567890',
    role: 'trainer'
  }],
  workout_plans: [{
    name: 'Beginner Plan',
    description: 'Beginner workout plan',
    trainer_id: 'trainer-uuid',
    difficulty: 'beginner'
  }],
  diet_plans: [{
    name: 'Protein Diet',
    description: 'High protein diet',
    trainer_id: 'trainer-uuid',
    daily_calories: 2000
  }],
  crm_leads: [{
    name: 'Lead Name',
    email: 'lead@example.com',
    phone: '1234567890',
    source: 'Website',
    status: 'new'
  }],
  inventory: [{
    name: 'Product',
    category: 'supplement',
    quantity: 10,
    price: 29.99,
    reorder_level: 5
  }]
};
