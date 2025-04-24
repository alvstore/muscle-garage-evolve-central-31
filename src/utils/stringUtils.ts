
export const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const formatCurrency = (amount: number, currency = 'USD', minimumFractionDigits = 0, maximumFractionDigits = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
};

export const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const timestamp = new Date().getTime().toString().slice(-6);
  return `${prefix}-${randomDigits}-${timestamp}`;
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
