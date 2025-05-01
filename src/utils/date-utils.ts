
/**
 * Converts a string date to a Date object
 * @param dateString ISO date string
 * @returns Date object
 */
export const stringToDate = (dateString?: string): Date | undefined => {
  if (!dateString) return undefined;
  return new Date(dateString);
};

/**
 * Formats a Date object to an ISO string
 * @param date Date object
 * @returns ISO date string
 */
export const dateToString = (date?: Date): string | undefined => {
  if (!date) return undefined;
  return date.toISOString();
};

/**
 * Formats a date for display
 * @param date Date object or string
 * @returns Formatted date string
 */
export const formatDate = (date?: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};
