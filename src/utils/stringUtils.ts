
/**
 * Format a number as currency with the appropriate symbol and decimals
 * @param amount - The amount to format
 * @param currencySymbol - The currency symbol to use (defaults to ₹)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencySymbol: string = '₹'): string => {
  // Handle undefined or NaN
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currencySymbol}0.00`;
  }

  return `${currencySymbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format a date string or Date object to a readable format
 * @param dateString - Date string or Date object
 * @param format - Format to use (short, medium, long)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'medium':
    default:
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  }
};

/**
 * Truncate a string to a certain length and add ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format a phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length (assuming Indian numbers)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  // Return original if not standard format
  return phone;
};

/**
 * Convert a number to its ordinal form (1st, 2nd, 3rd, etc.)
 * @param n - The number to convert
 * @returns Ordinal string
 */
export const getOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format membership duration in a human-readable format
 * @param days - Duration in days
 * @returns Formatted duration string
 */
export const formatMembershipDuration = (days: number): string => {
  if (days === 30 || days === 31) return '1 Month';
  if (days === 90 || days === 91) return '3 Months';
  if (days === 180 || days === 182) return '6 Months';
  if (days === 365 || days === 366) return '1 Year';
  
  // For other durations
  if (days >= 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    return `${years} ${years === 1 ? 'Year' : 'Years'}${remainingDays > 0 ? ` ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}` : ''}`;
  }
  
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months} ${months === 1 ? 'Month' : 'Months'}${remainingDays > 0 ? ` ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}` : ''}`;
  }
  
  return `${days} ${days === 1 ? 'Day' : 'Days'}`;
};
