
/**
 * Get initials from a name string
 * @param name Full name to extract initials from
 * @returns Uppercase initials from the name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Format currency with the given symbol and decimal places
 * @param amount Amount to format
 * @param symbol Currency symbol
 * @param decimals Number of decimal places
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, symbol = '₹', decimals = 2): string => {
  return `${symbol}${amount.toFixed(decimals)}`;
};

/**
 * Format a date string or timestamp to a user-friendly format
 * @param dateString Date string or timestamp
 * @param format Format to use ('short', 'long', or 'relative')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  if (format === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 30) {
      return date.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  } else if (format === 'long') {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString();
  }
};
