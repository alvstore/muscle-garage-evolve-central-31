
// Re-export services
export * from './api';
export * from './leadService';
export * from './followUpService';
export * from './invoiceService';
export * from './notificationService';

// Fix for default exports
export { default as leadService } from './leadService';
export { default as followUpService } from './followUpService';
export { default as invoiceService } from './invoiceService';
export { default as membersService } from './membersService';
export { default as trainersService } from './trainersService'; 
export { default as dietPlansService } from './dietPlansService';
export { default as workoutPlansService } from './workoutPlansService';
export { default as integrationsService } from './integrationsService';
