
import JSZip from 'jszip';
import { format } from 'date-fns';

// Utility function to format file sizes
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate README content
export const generateReadme = () => {
  return `# Muscle Garage Evolve Backend

A comprehensive backend system for managing gym operations with multi-branch architecture.

## Overview

This backend powers the Muscle Garage Evolve CRM platform using:
- Supabase for database and authentication
- Edge Functions for custom logic
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates

## Structure

- \`/database\`: Schema and RLS policies
- \`/functions\`: Edge Functions for custom logic
- \`/services\`: Core business logic
- \`/types\`: TypeScript type definitions
- \`/config\`: System configuration

## Setup

1. Create a Supabase project
2. Run the schema migrations
3. Deploy edge functions
4. Configure environment variables

## Documentation

See BACKEND_DOCUMENTATION.md for detailed API documentation.
`;
};

// Generate env example file
export const generateEnvExample = () => {
  return `# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/your-database"

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Authentication
JWT_SECRET="your-jwt-secret"

# External Services (if used)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_SECRET="your-razorpay-secret"

# Email Configuration (if used)
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"
`;
};

// Generate unique backup filename with timestamp
export const generateBackupFilename = (): string => {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
  return `backup-backend-${timestamp}.zip`;
};
