
/**
 * Convert a string date to a Date object
 * @param dateString String date in ISO format
 * @returns Date object or undefined if invalid
 */
export function stringToDate(dateString?: string): Date | undefined {
  if (!dateString) return undefined;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return undefined;
  }
}

/**
 * Convert a Date object to an ISO string
 * @param date Date object
 * @returns ISO string or undefined if invalid
 */
export function dateToString(date?: Date): string | undefined {
  if (!date || isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * Format a date for display
 * @param date Date object or string
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
