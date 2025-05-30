
// String utility functions
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPrice(price: number): string {
  return formatCurrency(price);
}

export function formatDuration(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? 'Year' : 'Years'}`;
  } else if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'Month' : 'Months'}`;
  } else {
    return `${days} ${days === 1 ? 'Day' : 'Days'}`;
  }
}

export function getInitials(name?: string): string {
  if (!name) return '';
  
  const parts = name.split(' ').filter(Boolean);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
