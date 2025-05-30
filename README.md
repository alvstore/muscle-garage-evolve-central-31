
# Muscle Garage - Gym CRM System

A comprehensive gym management system built with React, TypeScript, Supabase, and Tailwind CSS. This system provides complete management capabilities for gym operations including member management, class scheduling, financial tracking, CRM, and access control integration.

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling with **shadcn/ui** components
- **React Router v7** for navigation
- **TanStack Query** for data fetching and state management
- **React Hook Form** with Zod validation
- **Recharts** for analytics and reporting
- **Lucide React** for icons

### Backend Stack
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** database with Row Level Security (RLS)
- **Supabase Edge Functions** for custom backend logic
- **Supabase Storage** for file management

## 📁 Project Structure

```
/src
  /components            # Reusable UI components
    /access-control     # Hikvision/eSSL device integration
    /admin             # Admin-specific components
    /analytics         # Charts and reporting components
    /attendance        # Member check-in/check-out
    /auth              # Authentication forms and guards
    /branch            # Multi-branch management
    /classes           # Class scheduling and booking
    /communication     # Notifications, announcements
    /crm               # Lead management and follow-ups
    /dashboard         # Dashboard widgets and sections
    /finance           # Invoicing, payments, transactions
    /fitness           # Workout/diet plans, progress tracking
    /inventory         # Store and inventory management
    /marketing         # Campaigns and promotions
    /members           # Member profiles and management
    /settings          # System configuration
    /trainers          # Trainer management and assignment
    /ui                # Base UI components (shadcn/ui)
  
  /hooks               # Custom React hooks
    /auth             # Authentication hooks
    /classes          # Class management hooks
    /communication    # Notification hooks
    /data             # Data fetching hooks
    /finance          # Financial operation hooks
    /permissions      # Role-based access hooks
    /settings         # Settings management hooks
  
  /layouts             # Page layout components
  /pages               # Route components
  /router              # Route configuration
  /services            # API service functions
  /types               # TypeScript type definitions
    /core             # Core entity types (user, member, etc.)
    /features         # Feature-specific types
    /services         # Service-related types
    /ui               # UI component types
    /utils            # Utility types
  /utils               # Helper functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- (Optional) Hikvision/eSSL devices for access control

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd muscle-garage-crm
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment Integration (Optional)
VITE_RAZORPAY_KEY_ID=your_razorpay_key

# Access Control (Optional)
VITE_HIKVISION_API_URL=your_hikvision_api_url
```

4. **Database Setup**
The Supabase database schema is automatically synced. Key tables include:
- `profiles` - User profiles and roles
- `branches` - Multi-branch support
- `members` - Gym member data
- `trainers` - Trainer profiles and specializations
- `classes` - Class scheduling
- `invoices` - Billing and payments
- `leads` - CRM lead management

5. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:8080` to access the application.

## 🔐 Authentication & Roles

The system implements role-based access control with these roles:

- **Admin**: Full system access across all branches
- **Staff**: Branch-specific administrative access
- **Trainer**: Access to assigned members and fitness planning
- **Member**: Personal account and class booking access

### Default Admin Account
```
Email: Rajat.lekhari@hotmail.com
Password: Rajat@3003
```

## 🏢 Multi-Branch Architecture

The system supports multiple gym locations with:
- Branch-specific data isolation
- Cross-branch reporting for admins
- Branch-specific staff and trainer assignments
- Centralized member management with branch transfers

## 🧩 Key Features

### Member Management
- Complete member profiles with photos
- Membership plan assignment and tracking
- Progress tracking with body measurements
- Automated renewal notifications
- Member communication tools

### Class Scheduling
- Flexible class scheduling with recurring options
- Online class booking for members
- Trainer assignment and availability
- Capacity management and waitlists
- Attendance tracking

### Financial Management
- Invoice generation and tracking
- Multiple payment methods (cash, card, online)
- Razorpay payment gateway integration
- Expense tracking and categorization
- Financial reporting and analytics

### CRM & Lead Management
- Lead capture and scoring
- Automated follow-up sequences
- Lead conversion tracking
- Sales funnel visualization
- Communication templates

### Access Control Integration
- Hikvision device integration for automated check-ins
- Face recognition and card-based access
- Real-time attendance logging
- Door access privilege management

### Communication System
- Announcements and notifications
- Email, SMS, and WhatsApp integration
- Automated reminders
- Feedback collection
- Template management

## 🛠️ Development

### Code Style
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Conventional commits for git history
- Component-first architecture

### File Organization
- Components are organized by feature domain
- Shared UI components in `/components/ui`
- Business logic in custom hooks
- Type definitions organized by category

### Database Patterns
- All tables have RLS policies for security
- Audit logs for critical operations
- Optimistic updates with conflict resolution
- Real-time subscriptions for live data

### API Integration
```typescript
// Example service usage
import { memberService } from '@/services/members';

const members = await memberService.getMembers({
  branch_id: currentBranch.id,
  status: 'active'
});
```

## 📊 Analytics & Reporting

The system provides comprehensive analytics:
- Member growth and retention metrics
- Revenue tracking and forecasting
- Class attendance patterns
- Trainer performance metrics
- Equipment utilization reports

## 🔧 Configuration

### Payment Gateway Setup
1. Configure Razorpay keys in Settings > Payments
2. Set up webhook endpoints for payment confirmations
3. Test payments in sandbox mode

### Access Control Setup
1. Configure Hikvision API credentials
2. Add devices and door mappings
3. Sync member data with access control system
4. Set up privilege rules

### Communication Setup
1. Configure email provider (SendGrid/SMTP)
2. Set up SMS provider credentials
3. Configure WhatsApp Business API
4. Create message templates

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel/Netlify**: For static hosting
- **Docker**: Container-based deployment
- **Traditional hosting**: Build output can be served from any web server

### Environment Variables
Ensure all production environment variables are set:
- Supabase production URLs and keys
- Payment gateway production keys
- Communication service credentials

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (includes checks)
npm run build
```

## 📈 Performance Optimization

- Route-based code splitting
- Image optimization with lazy loading
- Database query optimization
- Caching strategies with TanStack Query
- Bundle size monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

## 📞 Support

For technical support or questions:
- Email: rajat.lekhari@hotmail.com
- Create an issue in the repository
- Check the documentation wiki

---

**Built with ❤️ for the fitness industry**
