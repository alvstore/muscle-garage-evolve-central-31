
/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: INR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  if (amount === null || amount === undefined) return '—';
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `₹${amount.toLocaleString()}`;
  }
};

/**
 * Truncate text with ellipsis if it exceeds the maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Format a phone number to a standard format
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
  }
  
  return phone;
};
