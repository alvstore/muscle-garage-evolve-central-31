
/**
 * Utility functions for string manipulation
 */

/**
 * Format currency value
 * @param value - Number to format as currency
 * @param currency - Currency code (default: INR)
 */
export const formatCurrency = (value: number, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Get initials from a name
 * @param name - Full name
 * @param count - Number of initials to return (default: 2)
 */
export const getInitials = (name: string, count = 2): string => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  let initials = '';
  
  // Get the first letter of each part, up to the specified count
  for (let i = 0; i < Math.min(count, parts.length); i++) {
    if (parts[i].length > 0) {
      initials += parts[i][0].toUpperCase();
    }
  }
  
  return initials;
};

/**
 * Truncate a string to a specified length and add ellipsis if necessary
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

/**
 * Convert a string to title case (capitalize first letter of each word)
 * @param str - String to convert
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Create an identifier by replacing spaces with hyphens and converting to lowercase
 * @param str - String to convert
 */
export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};
