
/**
 * Get initials from a name (e.g., "John Doe" => "JD")
 */
export function getInitials(name: string): string {
  if (!name) return 'NA';
  
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Format a time string to a readable format
 */
export function formatTime(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
