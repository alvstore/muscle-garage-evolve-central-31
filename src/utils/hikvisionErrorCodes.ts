
// Hikvision API Error Code Mappings
export const HIKVISION_ERROR_CODES: Record<string, string> = {
  // General Success
  '0': 'Success',
  
  // Authentication Errors
  'EVZ10001': 'Invalid API key or secret',
  'EVZ10002': 'Authentication failed',
  'EVZ10003': 'Token expired',
  'EVZ10004': 'Invalid token',
  'EVZ10029': 'API calling frequency exceeded limit',
  
  // Device Errors
  'EVZ20002': 'Device does not exist',
  'EVZ20007': 'The device is offline',
  'EVZ0012': 'Adding device failed',
  'EVZ20014': 'Incorrect device serial number',
  '0x400019F1': 'Maximum number of devices reached',
  
  // Person Management Errors
  'EVZ30001': 'Person already exists',
  'EVZ30002': 'Person not found',
  'EVZ30003': 'Invalid person data',
  'EVZ30004': 'Person synchronization failed',
  
  // Access Control Errors
  'EVZ40001': 'Access privilege configuration failed',
  'EVZ40002': 'Invalid door configuration',
  'EVZ40003': 'Access time conflict',
  
  // Time Function Module
  '0x00300001': 'Time synchronization failed',
  '0x00300002': 'Invalid NTP server address',
  '0x00300003': 'Incorrect time format',
  
  // Network Function Module
  '0x00400001': 'Parsing domain name failed',
  '0x00400004': 'IP addresses of devices conflicted',
  '0x00400006': 'Uploading failed',
  
  // Device Function Module
  '0x01400003': 'Certificates mismatched',
  '0x01400004': 'Device is not activated',
  '0x01400006': 'IP address is banned',
  
  // Face Management Module
  '0x4000109C': 'The library name already exists',
  '0x4000109D': 'No record found',
  
  // Security Control Module
  '0x40008000': 'Arming failed',
  '0x40008001': 'Disarming failed',
  '0x40008007': 'Registering timed out',
  
  // Database Errors
  '0x30000010': 'Searching in the database failed',
  '0x30001000': 'HBP Exception'
};

export const getHikvisionErrorMessage = (errorCode: string): string => {
  return HIKVISION_ERROR_CODES[errorCode] || `Unknown error code: ${errorCode}`;
};

export const isSuccessCode = (errorCode: string): boolean => {
  return errorCode === '0';
};

export const shouldRetry = (errorCode: string): boolean => {
  // These errors can be retried
  const retryableErrors = [
    'EVZ20007', // Device offline
    '0x00400001', // Network parsing failed
    '0x00400006', // Upload failed
    'EVZ10029' // Rate limit exceeded
  ];
  
  return retryableErrors.includes(errorCode);
};

export const getErrorSeverity = (errorCode: string): 'low' | 'medium' | 'high' | 'critical' => {
  if (errorCode === '0') return 'low';
  
  const criticalErrors = ['EVZ10001', 'EVZ10002', '0x01400004'];
  const highErrors = ['EVZ20002', 'EVZ30002', 'EVZ40001'];
  const mediumErrors = ['EVZ20007', 'EVZ30004', 'EVZ10029'];
  
  if (criticalErrors.includes(errorCode)) return 'critical';
  if (highErrors.includes(errorCode)) return 'high';
  if (mediumErrors.includes(errorCode)) return 'medium';
  
  return 'low';
};
