// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format large numbers with K, M suffixes
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Format percentage
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// Format time
export const formatTime = (time: number): string => {
  const hours = time % 24;
  return `${hours.toString().padStart(2, '0')}:00`;
};

// Format date
export const formatDay = (day: number): string => {
  return `Day ${day}`;
};

// Calculate percentage change
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return (current - previous) / previous;
};

// Format a timestamp
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};