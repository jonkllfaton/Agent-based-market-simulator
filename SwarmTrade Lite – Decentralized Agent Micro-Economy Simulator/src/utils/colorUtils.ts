// Generate vibrant colors for agents
export const getRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
  const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Get color based on agent type
export const getAgentTypeColor = (type: string): string => {
  switch (type) {
    case 'buyer':
      return 'rgba(52, 211, 153, 0.8)'; // Green
    case 'seller':
      return 'rgba(239, 68, 68, 0.8)'; // Red
    case 'arbitrageur':
      return 'rgba(59, 130, 246, 0.8)'; // Blue
    default:
      return 'rgba(161, 161, 170, 0.8)'; // Gray
  }
};

// Get color for price trends
export const getPriceChangeColor = (change: number): string => {
  if (change > 0) {
    return 'text-emerald-500';
  } else if (change < 0) {
    return 'text-red-500';
  }
  return 'text-gray-400';
};

// Get background color for market health
export const getMarketHealthColor = (health: number): string => {
  if (health > 0.7) {
    return 'bg-gradient-to-r from-emerald-500 to-teal-600';
  } else if (health > 0.4) {
    return 'bg-gradient-to-r from-amber-500 to-yellow-600';
  } else {
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  }
};

// Get agent strategy color
export const getStrategyColor = (strategy: string): string => {
  switch (strategy) {
    case 'aggressive':
      return 'text-red-400';
    case 'conservative':
      return 'text-blue-400';
    case 'balanced':
      return 'text-purple-400';
    case 'random':
      return 'text-amber-400';
    default:
      return 'text-gray-400';
  }
};