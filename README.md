
# Muscle Garaage - Gym CRM Backend

A comprehensive backend system for managing gym operations with multi-branch architecture, role-based access control, and integrated fitness management.

## 📋 Overview

This backend powers the Muscle Garage Evolve CRM platform, providing APIs and services for:

- **Member Management**: Registration, profiles, membership plans, and attendance tracking
- **Branch Operations**: Multi-branch architecture with isolated data per location
- **Staff & Trainer Management**: Role-based access with appropriate permissions
- **Fitness Planning**: Workout plans, diet plans, and progress tracking
- **Financial Operations**: Invoicing, payments with Razorpay integration, transaction tracking
- **CRM Features**: Lead management, follow-ups, and sales funnel
- **Access Control**: Integration with physical access control devices (Hikvision/eSSL)
- **Communication**: Email, SMS, and WhatsApp notifications

## 🛠️ Technologies Used

- **Database**: PostgreSQL via Supabase
- **API Layer**: Supabase API with Row Level Security (RLS) policies
- **Authentication**: Supabase Auth with JWT
- **Edge Functions**: Deno-based serverless functions for custom backend logic
- **Real-time**: Supabase Realtime for live updates
- **Storage**: Supabase Storage for file uploads
- **Webhooks**: For payment gateway and device integrations
- **DevOps**: GitHub Actions for CI/CD

## 📁 Project Structure

```
/supabase
  /functions                 # Serverless edge functions
    /attendance-webhook      # Integration with access control devices
    /razorpay-webhook        # Payment gateway webhooks
    /send-notifications      # Email/SMS/WhatsApp notifications
    /generate-reports        # PDF report generation
  /migrations               # Database migrations
  config.toml               # Edge functions configuration

/src
  /components               # Reusable UI components
    /access-control/        # Access control components
    /admin/                 # Admin-specific components
    /analytics/             # Data visualization components
    /attendance/            # Attendance-related components
    /auth/                  # Authentication components
    /branch/                # Branch management components
    /classes/               # Class management components
    /communication/         # Messaging and notifications
    /crm/                   # CRM components
    /finance/               # Financial components
    /fitness/               # Workout and diet plan components
    /inventory/             # Inventory management
    /layout/                # Layout components
    /members/               # Member management
    /settings/              # System settings components
    /shared/                # Shared UI components
    /staff/                 # Staff management
    /templates/             # Email/template components
    /theme/                 # Theming components
    /ui/                    # Base UI components

  /services                 # API service functions
    /api/                   # API client configuration
    /auth/                  # Authentication services
    /classes/               # Class management
    /crm/                   # CRM services
    /finance/               # Financial services
    /fitness/               # Workout and diet services
    /integrations/          # Third-party integrations
    /members/               # Member services
    /notifications/         # Notification services
    /settings/              # System settings
    /storage/               # File storage operations
    /supabase/              # Supabase-specific services
    /trainers/              # Trainer services

  /types                    # TypeScript type definitions
    /core/                  # Core domain models
      /auth/                # Authentication types
      /branch/              # Branch types
      /class/               # Class types
      /member/              # Member types
      /membership/          # Membership types
      /payment/             # Payment types
    
    /features/            # Feature-specific types
      /attendance/          # Attendance tracking
      /crm/                 # CRM and lead management
      /dashboard/           # Dashboard types
      /finance/             # Financial types
      /fitness/            # Fitness-related types
      /settings/           # System settings
    
    /services/           # Service layer types
      /api/                # API request/response types
      /supabase/           # Supabase-specific types
    
    /ui/                 # UI component types
      /forms/              # Form-related types
      /tables/             # Data table types
    
    /utils/              # Utility types
      /api/                # API utility types
      /common/             # Common utility types
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local development)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/muscle-garage-evolve.git
cd muscle-garage-evolve
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# Supabase Configuration
VITE_SUPABASE_URL=https://rnqgpucxlvubwqpkgstc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Communication Services
SMS_API_KEY=...
WHATSAPP_API_KEY=...
SENDGRID_API_KEY=...

# Access Control Integration
HIKVISION_APP_KEY=...
HIKVISION_SECRET_KEY=...
```

### Running Locally

1. Start the development server:
```bash
npm run dev
```

2. For local Supabase development:
```bash
supabase start
```

### Database Setup & Migrations

#### Initial Setup with Supabase

1. Create a new project in [Supabase](https://supabase.com/)
2. Run the schema migrations:
```bash
supabase db push
```

3. Seed initial data (if needed):
```bash
supabase db reset --seed-data
```

#### Manual SQL Migrations

You can also run migrations manually in the Supabase dashboard SQL editor:

1. Navigate to your project's SQL Editor
2. Copy schema from `/supabase/migrations` directory
3. Execute the SQL statements

## 🔑 Authentication & Authorization

### Role-Based Access Control

The system implements a comprehensive RBAC system with these main roles:

- **Super Admin**: Full access across all branches
- **Branch Admin**: Full access to a specific branch
- **Staff**: Limited admin capabilities for a branch
- **Trainer**: Access to assigned members and fitness planning
- **Member**: Personal account access only

### Row Level Security (RLS)

Data is protected by Row Level Security policies in Supabase that filter data based on:

1. User role
2. Branch assignment
3. Ownership (for members and trainers)

## 📂 File Storage

Muscle Garage uses Supabase Storage for file management:

### Storage Buckets

Two main storage buckets are used:

1. **avatars**: For profile pictures and member photos
2. **documents**: For medical records, contracts, and other documents

### Usage Instructions

#### Uploading Files

```typescript
import { uploadFile } from '@/services/storageService';

// Upload a profile image
const uploadProfileImage = async (memberId: string, file: File) => {
  const fileName = `${memberId}-${Date.now()}.jpg`;
  const filePath = `${memberId}/${fileName}`;
  
  const imageUrl = await uploadFile('avatars', filePath, file);
  return imageUrl;
};
```

#### Retrieving Files

```typescript
// Get file URL from storage
const getFileUrl = (bucket: string, filePath: string) => {
  return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
};
```

#### Deleting Files

```typescript
import { deleteFile } from '@/services/storageService';

// Delete a file
const deleteProfileImage = async (filePath: string) => {
  return await deleteFile('avatars', filePath);
};
```

### Best Practices

1. **Content Types**: Always set the correct content-type when uploading files
2. **File Organization**: Use member/entity IDs in file paths for proper organization
3. **Permissions**: Remember files are protected by RLS - ensure proper access policies
4. **File Size**: Limit uploads to 50MB or less (current bucket setting)

## 📡 API Documentation

### Member Management

#### GET /members
- **Description**: Retrieve members with pagination and filters
- **Authorization**: Admin, Staff, Trainer (limited to assigned)
- **Parameters**:
  - `branch_id`: Filter by branch
  - `status`: Filter by status (active, inactive, etc)
  - `page`, `limit`: Pagination controls

#### POST /members
- **Description**: Create a new member
- **Authorization**: Admin, Staff
- **Body**: Member details including personal info and membership

#### PUT /members/:id
- **Description**: Update member information
- **Authorization**: Admin, Staff, Self (limited fields)

#### GET /members/:id/attendance
- **Description**: Get attendance history for a member
- **Authorization**: Admin, Staff, Trainer (if assigned), Self

### Fitness Management

#### GET /workout-plans
- **Description**: Retrieve workout plans
- **Authorization**: Admin, Trainer, Self (limited)
- **Parameters**:
  - `trainer_id`: Filter by creator
  - `member_id`: Filter by assigned member
  - `is_global`: Filter templates vs. assigned plans

#### POST /workout-plans
- **Description**: Create a new workout plan
- **Authorization**: Admin, Trainer

#### GET /diet-plans
- **Description**: Retrieve diet plans
- **Authorization**: Admin, Trainer, Self (limited)
- **Parameters**:
  - `trainer_id`: Filter by creator
  - `member_id`: Filter by assigned member

### Classes & Scheduling

#### GET /classes
- **Description**: Get class schedule
- **Authorization**: All authenticated users
- **Parameters**:
  - `branch_id`: Filter by branch
  - `trainer_id`: Filter by trainer
  - `from_date`, `to_date`: Date range

#### POST /bookings
- **Description**: Book a class
- **Authorization**: Admin, Staff, Member
- **Body**: Class ID, member ID

### Financial Operations

#### GET /invoices
- **Description**: Retrieve invoices
- **Authorization**: Admin, Staff, Self (limited)
- **Parameters**:
  - `member_id`: Filter by member
  - `status`: Filter by payment status

#### POST /payments/razorpay/create
- **Description**: Create a Razorpay payment order
- **Authorization**: Admin, Staff, Member

## 🔌 Integration Points

### Frontend Integration

The backend exposes RESTful APIs that can be consumed by:

```javascript
// Example API call with authentication
import { supabase } from '@/services/supabaseClient';

async function fetchMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('branch_id', currentBranchId);
  
  if (error) throw error;
  return data;
}
```

### Mobile App Integration

The same Supabase APIs can be used with mobile clients:

- Use the Supabase JS client for React Native
- Use the Supabase REST API for native iOS/Android apps

### Webhook Integration

For third-party services, webhook endpoints are provided:

- `/supabase/functions/razorpay-webhook`: Payment callbacks
- `/supabase/functions/attendance-webhook`: Device callbacks

## 💾 Backup & Export

### Manual Export

1. Navigate to Supabase Dashboard > Database
2. Use the "Backup" feature to export data
3. Download the SQL dump

### Programmatic Export

```javascript
// Using the API to export data
async function exportMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*');
  
  if (error) throw error;
  
  // Convert to CSV
  const csv = convertToCSV(data);
  downloadCSV(csv, 'members-export.csv');
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Failed**: Check JWT expiration and refresh tokens
2. **RLS Policies Blocking Data**: Verify user roles and branch assignments
3. **Edge Function Errors**: Check logs in Supabase Dashboard
4. **Storage Errors**: Ensure RLS policies allow access, check bucket permissions
5. **File Upload Issues**: Verify content-type headers and RLS permissions

### Logs & Monitoring

- Edge Function logs: Supabase Dashboard > Edge Functions > Logs
- Database logs: Supabase Dashboard > Database > Logs
- Storage logs: Supabase Dashboard > Storage > Logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. Unauthorized copying, transfer, or reproduction of the contents is strictly prohibited.

## 📞 Support

For support, please contact rajat.lekhari@hotmail.com
