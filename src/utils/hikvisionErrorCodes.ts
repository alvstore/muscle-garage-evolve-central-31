export const getHikvisionErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Device errors
    'EVZ20002': 'Device does not exist',
    'EVZ20007': 'The device is offline',
    'EVZ0012': 'Adding device failed',
    'EVZ20014': 'Incorrect device serial number',
    '0x400019F1': 'The maximum number of devices reached',
    
    // Database errors
    '0x30000010': 'Database search failed',
    '0x30001000': 'HBP Exception',
    
    // Time function errors
    '0x00300001': 'Time synchronization failed',
    '0x00300002': 'Invalid NTP server address',
    '0x00300003': 'Incorrect time format',
    
    // Network errors
    '0x00400001': 'Parsing domain name failed',
    '0x00400004': 'IP addresses of devices conflicted',
    '0x00400006': 'Uploading failed',
    
    // Device function errors
    '0x01400003': 'Certificates mismatched',
    '0x01400004': 'Device is not activated',
    '0x01400006': 'IP address is banned',
    
    // Face management errors
    '0x4000109C': 'The library name already exists',
    '0x4000109D': 'No record found',
    
    // Security control errors
    '0x40008000': 'Arming failed',
    '0x40008001': 'Disarming failed',
    '0x40008007': 'Registering timed out',
    
    // Rate limiting
    'EVZ10029': 'API calling frequency exceeded limit',
  };
  
  return errorMessages[errorCode] || 'Unknown error';
};