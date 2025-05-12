
# Muscle Garage Evolve - Backend Documentation

This document provides a comprehensive overview of the backend architecture, organized by dashboard roles, endpoints, and system components.

## 🏗️ System Architecture

The Muscle Garage Evolve backend is built on a multi-branch architecture with strict data isolation and role-based access control:

1. **Database Layer**: PostgreSQL via Supabase with Row Level Security
2. **API Layer**: Supabase REST API + Custom Edge Functions
3. **Auth Layer**: JWT-based authentication with role permissions
4. **Integration Layer**: Webhooks for third-party services

### Multi-Branch Architecture

All major database tables include a `branch_id` field that enables:
- Data isolation between branches
- Cross-branch reporting for super admins
- Role-specific data access
- Branch identification via unique `branch_code` field

## 👩‍💼 Admin Dashboard Backend

The admin dashboard has full system access with comprehensive CRUD operations.

### Key Files

#### Services
- `src/services/settingsService.ts`: System-wide settings management
  - Global settings (Razorpay, SMS, Email, WhatsApp)
  - Branch-specific settings
  - Access control device configurations
  - Role and permission management

- `src/services/branchService.ts`: Branch management
  - Create/update/delete branch locations
  - Assign managers and staff to branches
  - Configure branch-specific settings

- `src/services/membershipService.ts`: Membership plan management
  - Define membership tiers and pricing
  - Configure access control rules
  - Manage plan benefits and durations

#### Types
- `src/types/branch.ts`: Branch data structures
- `src/types/settings.ts`: System settings interfaces
- `src/types/device-mapping.ts`: Access control device mapping

#### Edge Functions
- `supabase/functions/admin-reports/index.ts`: Advanced reporting
- `supabase/functions/system-backup/index.ts`: Database backup and restore

### Protected Endpoints

All admin endpoints require the `admin` role in the JWT token:

- `GET /branches`: List all branches
- `POST /branches`: Create a new branch
- `PUT /branches/:id`: Update branch information
- `DELETE /branches/:id`: Deactivate a branch
- `GET /settings/global`: Retrieve global settings
- `PUT /settings/global`: Update global settings
- `GET /settings/:branchId`: Get branch-specific settings
- `PUT /settings/:branchId`: Update branch-specific settings

## 👨‍💼 Staff Dashboard Backend

Staff have branch-scoped administrative capabilities with limited configuration access.

### Key Files

#### Services
- `src/services/memberService.ts`: Member management
  - Registration and profile management
  - Membership assignment and renewal
  - Attendance tracking and reporting

- `src/services/classScheduleService.ts`: Class scheduling
  - Create and manage class schedules
  - Assign trainers to classes
  - Track attendance and capacity

- `src/services/crmService.ts`: Lead and member CRM
  - Manage lead pipeline
  - Schedule follow-ups and communications
  - Track conversions

#### Types
- `src/types/member.ts`: Member data structures
- `src/types/class.ts`: Class scheduling interfaces
- `src/types/crm.ts`: CRM data types

#### Edge Functions
- `supabase/functions/send-notifications/index.ts`: Communication service
- `supabase/functions/export-members/index.ts`: Member data exports

### Protected Endpoints

Staff endpoints require either `admin` or `staff` role, and filter by `branchId`:

- `GET /members`: List branch members
- `POST /members`: Register new member
- `PUT /members/:id`: Update member details
- `GET /classes`: View branch class schedule
- `POST /classes`: Create new class
- `PUT /classes/:id`: Update class details
- `GET /leads`: View branch leads
- `POST /leads`: Add new lead
- `PUT /leads/:id/stage`: Update lead stage

## 👨‍🏫 Trainer Dashboard Backend

Trainers can manage their assigned members, create fitness plans, and track progress.

### Key Files

#### Services
- `src/services/workoutService.ts`: Workout plan management
  - Create plan templates
  - Assign plans to members
  - Track workout adherence

- `src/services/dietPlanService.ts`: Diet plan management
  - Create meal plans
  - Assign nutritional guidelines
  - Track dietary adherence

- `src/services/measurementService.ts`: Progress tracking
  - Record body measurements
  - Track fitness metrics
  - Generate progress reports

#### Types
- `src/types/workout.ts`: Workout plan interfaces
- `src/types/diet.ts`: Diet plan interfaces
- `src/types/measurements.ts`: Measurement tracking types

#### Edge Functions
- `supabase/functions/generate-fitness-report/index.ts`: PDF report generation
- `supabase/functions/trainer-notifications/index.ts`: Progress alerts

### Protected Endpoints

Trainer endpoints verify the `trainer` role and filter by assigned members:

- `GET /trainers/:id/members`: List assigned members
- `GET /workout-plans`: View created workout plans
- `POST /workout-plans`: Create new workout plan
- `PUT /workout-plans/:id`: Update workout plan
- `GET /diet-plans`: View created diet plans  
- `POST /diet-plans`: Create new diet plan
- `PUT /diet-plans/:id`: Update diet plan
- `POST /members/:id/measurements`: Record member measurements
- `GET /members/:id/progress`: View member progress

## 🏋️ Member Dashboard Backend

Members have access to their personal data, bookings, and self-service features.

### Key Files

#### Services
- `src/services/classService.ts`: Class booking service
  - View available classes
  - Book and cancel classes
  - Track attendance

- `src/services/invoiceService.ts`: Invoice and payment
  - View billing history
  - Process payments via Razorpay
  - Download invoices

- `src/services/progressService.ts`: Self-tracking
  - View assigned plans
  - Log workout completion
  - Track personal progress

#### Types
- `src/types/class-booking.ts`: Class booking interfaces
- `src/types/invoice.ts`: Invoice and payment types
- `src/types/progress.ts`: Progress tracking types

#### Edge Functions
- `supabase/functions/generate-invoice/index.ts`: PDF invoice generation
- `supabase/functions/member-notifications/index.ts`: Reminder service

### Protected Endpoints

Member endpoints verify user identity and only allow access to personal data:

- `GET /members/:id`: View own profile (id must match auth.uid)
- `PUT /members/:id`: Update limited profile fields
- `GET /classes`: View available classes
- `POST /bookings`: Book a class
- `DELETE /bookings/:id`: Cancel booking
- `GET /members/:id/invoices`: View personal invoices
- `GET /members/:id/workouts`: View assigned workout plans
- `GET /members/:id/diets`: View assigned diet plans
- `POST /members/:id/workout-logs`: Log workout completion

## 🔄 Integration Services

### Payment Gateway (Razorpay)

#### Files
- `src/services/razorpayService.ts`: Payment integration service
- `supabase/functions/razorpay-webhook/index.ts`: Payment webhook handler

#### Key Features
- Payment order creation
- Payment capture and verification
- Invoice generation
- Payment failure handling

### Access Control Devices

#### Files
- `src/services/integrations/hikvisionService.ts`: Hikvision integration
- `src/services/integrations/esslService.ts`: eSSL integration
- `supabase/functions/attendance-webhook/index.ts`: Device webhook handler

#### Key Features
- Member access permissions based on membership
- Attendance recording via device events
- Device configuration management

### Communication Services

#### Files
- `src/services/integrations/messagingService.ts`: Central messaging service
- `supabase/functions/send-email/index.ts`: Email sending service
- `supabase/functions/send-sms/index.ts`: SMS sending service
- `supabase/functions/send-whatsapp/index.ts`: WhatsApp messaging service

#### Key Features
- Templated messaging
- Scheduled notifications
- Multi-channel delivery

## 🛡️ Security Implementation

### Row-Level Security Policies

All database tables have RLS policies that:

1. Filter data by branch for staff and trainers
2. Limit member access to their own data
3. Allow super admins to view all data

### Storage Bucket Security

The system uses two primary storage buckets:

1. `avatars`: For profile pictures and member photos
   - INSERT policies: Authenticated users can upload to this bucket
   - SELECT policies: Authenticated users can view avatars

2. `documents`: For medical records, contracts, and other documents
   - INSERT policies: Authenticated users can upload to this bucket
   - SELECT policies: Authenticated users can view documents

Each upload should include proper content-type headers. File paths should be structured to include user or entity IDs for proper organization and security, for example: `{memberId}/{fileName}`.

### Middleware Guards

API access is protected by middleware that:

1. Verifies JWT tokens
2. Checks user roles against required permissions
3. Validates branch access for multi-branch operations

## 📈 Real-Time Features

The following tables have real-time subscriptions enabled:

- `member_attendance`: For real-time attendance dashboards
- `class_bookings`: For class capacity updates
- `payments`: For financial dashboards

## 🧪 Testing

Backend tests are organized in the `tests` directory:

- `tests/unit`: Unit tests for service functions
- `tests/integration`: API endpoint tests
- `tests/e2e`: End-to-end workflows

Run tests with:

```bash
npm run test:unit     # Run unit tests
npm run test:api      # Run API tests
npm run test:e2e      # Run end-to-end tests
```

## 🚀 Deployment

### Production Setup

1. Configure environment variables in Supabase Dashboard
2. Deploy Edge Functions via Supabase CLI or GitHub Actions
3. Apply database migrations
4. Set up webhooks for integrations

### Monitoring

1. Edge Function logs: Supabase Dashboard > Edge Functions > Logs
2. Database performance: Supabase Dashboard > Database > Performance
3. API usage: Supabase Dashboard > API > Usage Statistics

## 🌱 Future Enhancements

1. **Advanced Analytics**: Implementing predictive analytics for member retention
2. **Mobile App API**: Enhanced endpoints for native mobile applications
3. **Integration Marketplace**: Pluggable modules for additional gym software
4. **Multi-language Support**: Internationalization of notification templates

