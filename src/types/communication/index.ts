// Communication types index file
// Re-export all types from individual modules

// Core notification types
export * from './notification';

// Reminder related types
export * from './reminder';

// SMS related types
export * from './sms';

// Webhook related types
export * from './webhooks';

// Re-export commonly used types for backward compatibility
export type {
  Notification,
  Announcement,
  Feedback,
  FeedbackSummary,
  FeedbackType,
  EmailSettings,
  NotificationChannel,
  MotivationalMessage,
  adaptFeedbackFromDB
} from './notification';

// Export types from other modules
export type { ReminderRule } from './reminder';
export type { SmsProvider, SmsSettings } from './sms';
export type { 
  RazorpayWebhook, 
  WebhookStatus,
  RazorpayEventType 
} from './webhooks';
