import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(price)
}

export function formatDuration(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365)
    return `${years} ${years === 1 ? 'Year' : 'Years'}`
  } else if (days >= 30) {
    const months = Math.floor(days / 30)
    return `${months} ${months === 1 ? 'Month' : 'Months'}`
  } else {
    return `${days} ${days === 1 ? 'Day' : 'Days'}`
  }
}

/**
 * Formats a number as currency in Indian Rupees.
 *
 * @param amount The amount to format.
 * @returns The formatted amount.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Generate initials from a name
 * @param name Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name?: string): string {
  if (!name) return '';
  
  const parts = name.split(' ').filter(Boolean);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Get first letter of first and last name
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
