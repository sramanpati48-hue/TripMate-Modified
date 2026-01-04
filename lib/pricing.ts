// Real-time pricing utility for Indian Travel Companion
// Calculates dynamic prices based on various factors

export type Season = 'Summer' | 'Winter' | 'Monsoon' | 'Spring' | 'Autumn';
export type PriceCategory = 'budget' | 'moderate' | 'premium' | 'luxury';

interface PricingFactors {
  basePriceMin: number;
  basePriceMax: number;
  seasonMultiplier: number;
  demandMultiplier: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
}

// Get current season based on month
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 3 && month <= 5) return 'Summer';
  if (month >= 6 && month <= 9) return 'Monsoon';
  if (month >= 10 && month <= 11) return 'Autumn';
  if (month === 12 || month <= 2) return 'Winter';
  return 'Spring';
}

// Get season multiplier (peak season = higher prices)
export function getSeasonMultiplier(currentSeason: Season, bestSeasons: Season[]): number {
  // If current season is one of the best seasons, apply peak pricing
  if (bestSeasons.includes(currentSeason)) {
    return 1.3; // 30% increase during peak season
  }
  
  // Monsoon typically has lowest prices
  if (currentSeason === 'Monsoon') {
    return 0.7; // 30% discount
  }
  
  return 1.0; // Normal pricing
}

// Get demand multiplier based on day of week
export function getDemandMultiplier(): number {
  const day = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  
  // Weekend pricing (Friday-Sunday)
  if (day === 0 || day === 5 || day === 6) {
    return 1.2; // 20% increase on weekends
  }
  
  return 1.0; // Normal weekday pricing
}

// Check if current date is a major Indian holiday
export function isIndianHoliday(): boolean {
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  
  // Major holidays (approximate dates, some vary by lunar calendar)
  const holidays = [
    { month: 1, date: 26 }, // Republic Day
    { month: 3, date: 8 },  // Holi (approximate)
    { month: 8, date: 15 }, // Independence Day
    { month: 10, date: 2 }, // Gandhi Jayanti
    { month: 10, date: 24 }, // Dussehra (approximate)
    { month: 11, date: 12 }, // Diwali (approximate)
    { month: 12, date: 25 }, // Christmas
  ];
  
  return holidays.some(h => h.month === month && Math.abs(h.date - date) <= 2);
}

// Get holiday multiplier
export function getHolidayMultiplier(): number {
  return isIndianHoliday() ? 1.5 : 1.0; // 50% increase during holidays
}

// Calculate dynamic price range
export function calculateDynamicPrice(
  basePriceMin: number,
  basePriceMax: number,
  bestSeasons: Season[] = []
): string {
  const currentSeason = getCurrentSeason();
  const seasonMultiplier = getSeasonMultiplier(currentSeason, bestSeasons);
  const demandMultiplier = getDemandMultiplier();
  const holidayMultiplier = getHolidayMultiplier();
  
  // Apply all multipliers
  const totalMultiplier = seasonMultiplier * demandMultiplier * holidayMultiplier;
  
  const minPrice = Math.round(basePriceMin * totalMultiplier);
  const maxPrice = Math.round(basePriceMax * totalMultiplier);
  
  if (minPrice === maxPrice) {
    return `₹${minPrice.toLocaleString('en-IN')}`;
  }
  
  return `₹${minPrice.toLocaleString('en-IN')}-${maxPrice.toLocaleString('en-IN')}`;
}

// Calculate activity/service cost
export function calculateActivityCost(
  basePrice: number,
  category: 'entry' | 'food' | 'transport' | 'activity' | 'accommodation' = 'activity'
): string {
  const currentSeason = getCurrentSeason();
  let multiplier = 1.0;
  
  // Apply category-specific adjustments
  switch (category) {
    case 'entry':
      // Entry fees are usually fixed or have minimal variation
      multiplier = 1.0 + (getDemandMultiplier() - 1) * 0.5;
      break;
    case 'food':
      // Food prices are relatively stable
      multiplier = 1.0 + (getDemandMultiplier() - 1) * 0.3;
      break;
    case 'transport':
      // Transport varies with demand
      multiplier = getDemandMultiplier() * (isIndianHoliday() ? 1.3 : 1.0);
      break;
    case 'accommodation':
      // Accommodation varies most with season and demand
      multiplier = getDemandMultiplier() * getHolidayMultiplier() * (currentSeason === 'Monsoon' ? 0.8 : 1.0);
      break;
    case 'activity':
      // Activities vary moderately
      multiplier = getDemandMultiplier() * (isIndianHoliday() ? 1.2 : 1.0);
      break;
  }
  
  const finalPrice = Math.round(basePrice * multiplier);
  return `₹${finalPrice.toLocaleString('en-IN')}`;
}

// Calculate price range for activities
export function calculateActivityCostRange(
  basePriceMin: number,
  basePriceMax: number,
  category: 'entry' | 'food' | 'transport' | 'activity' | 'accommodation' = 'activity'
): string {
  const currentSeason = getCurrentSeason();
  let multiplier = 1.0;
  
  switch (category) {
    case 'entry':
      multiplier = 1.0 + (getDemandMultiplier() - 1) * 0.5;
      break;
    case 'food':
      multiplier = 1.0 + (getDemandMultiplier() - 1) * 0.3;
      break;
    case 'transport':
      multiplier = getDemandMultiplier() * (isIndianHoliday() ? 1.3 : 1.0);
      break;
    case 'accommodation':
      multiplier = getDemandMultiplier() * getHolidayMultiplier() * (currentSeason === 'Monsoon' ? 0.8 : 1.0);
      break;
    case 'activity':
      multiplier = getDemandMultiplier() * (isIndianHoliday() ? 1.2 : 1.0);
      break;
  }
  
  const minPrice = Math.round(basePriceMin * multiplier);
  const maxPrice = Math.round(basePriceMax * multiplier);
  
  return `₹${minPrice.toLocaleString('en-IN')}-${maxPrice.toLocaleString('en-IN')}`;
}

// Get pricing tooltip explaining current rates
export function getPricingTooltip(): string {
  const season = getCurrentSeason();
  const isWeekend = getDemandMultiplier() > 1.0;
  const isHoliday = isIndianHoliday();
  
  let tooltip = `Current pricing (${season})`;
  
  if (isHoliday) {
    tooltip += ' • Holiday rates apply (+50%)';
  } else if (isWeekend) {
    tooltip += ' • Weekend rates (+20%)';
  }
  
  if (season === 'Monsoon') {
    tooltip += ' • Off-season discount (-30%)';
  }
  
  return tooltip;
}

// Export pricing factors for display
export function getCurrentPricingFactors() {
  return {
    season: getCurrentSeason(),
    seasonMultiplier: getSeasonMultiplier(getCurrentSeason(), []),
    demandMultiplier: getDemandMultiplier(),
    holidayMultiplier: getHolidayMultiplier(),
    isWeekend: getDemandMultiplier() > 1.0,
    isHoliday: isIndianHoliday(),
    tooltip: getPricingTooltip(),
  };
}
