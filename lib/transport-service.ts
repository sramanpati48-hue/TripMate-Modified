// Real-time Transport and Fare Calculation Service for Indian Travel Companion
// Provides dynamic fare estimates for various transport modes in India

import { getDemandMultiplier, getHolidayMultiplier, getCurrentSeason } from './pricing';

export type TransportMode = 
  | 'metro' 
  | 'auto-rickshaw' 
  | 'taxi' 
  | 'ola-mini' 
  | 'ola-sedan'
  | 'uber-go'
  | 'uber-premier'
  | 'local-bus'
  | 'app-bike'
  | 'rental-car'
  | 'train'
  | 'flight'
  | 'none';

export interface TransportFare {
  mode: TransportMode;
  baseFare: number;
  perKmRate: number;
  minimumFare: number;
  estimatedFare: number;
  estimatedTime: string;
  availability: 'high' | 'medium' | 'low';
  description: string;
}

export interface TransportRoute {
  from: string;
  to: string;
  distance: number; // in kilometers
  estimatedDuration: number; // in minutes
  options: TransportFare[];
}

// Base rates for different transport modes (as of 2024-2025)
const BASE_RATES: Record<TransportMode, { baseFare: number; perKm: number; minFare: number }> = {
  'metro': { baseFare: 10, perKm: 0, minFare: 10 },
  'auto-rickshaw': { baseFare: 25, perKm: 12, minFare: 25 },
  'taxi': { baseFare: 50, perKm: 18, minFare: 50 },
  'ola-mini': { baseFare: 35, perKm: 10, minFare: 35 },
  'ola-sedan': { baseFare: 60, perKm: 14, minFare: 60 },
  'uber-go': { baseFare: 30, perKm: 9, minFare: 30 },
  'uber-premier': { baseFare: 80, perKm: 16, minFare: 80 },
  'local-bus': { baseFare: 5, perKm: 0.5, minFare: 5 },
  'app-bike': { baseFare: 15, perKm: 5, minFare: 15 },
  'rental-car': { baseFare: 2000, perKm: 15, minFare: 2000 },
  'train': { baseFare: 50, perKm: 0.5, minFare: 20 },
  'flight': { baseFare: 3000, perKm: 5, minFare: 2500 },
  'none': { baseFare: 0, perKm: 0, minFare: 0 },
};

// Get transport mode display name
export function getTransportModeName(mode: TransportMode): string {
  const names: Record<TransportMode, string> = {
    'metro': 'Metro',
    'auto-rickshaw': 'Auto Rickshaw',
    'taxi': 'Taxi',
    'ola-mini': 'Ola Mini',
    'ola-sedan': 'Ola Sedan',
    'uber-go': 'Uber Go',
    'uber-premier': 'Uber Premier',
    'local-bus': 'Local Bus',
    'app-bike': 'Bike (Rapido/Ola)',
    'rental-car': 'Rental Car (Full Day)',
    'train': 'Train',
    'flight': 'Flight',
    'none': 'Walking',
  };
  return names[mode];
}

// Calculate surge/peak pricing multiplier
function getSurgeMultiplier(mode: TransportMode, time?: string): number {
  const demandMultiplier = getDemandMultiplier();
  const holidayMultiplier = getHolidayMultiplier();
  
  // Parse time to determine if it's peak hours
  let isPeakHour = false;
  if (time) {
    const hour = parseInt(time.split(':')[0]);
    // Peak hours: 7-10 AM and 5-9 PM
    isPeakHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 21);
  }
  
  // Cab aggregators have surge pricing
  if (['ola-mini', 'ola-sedan', 'uber-go', 'uber-premier', 'app-bike'].includes(mode)) {
    let surge = 1.0;
    
    if (isPeakHour) surge *= 1.5; // 50% surge during peak hours
    if (holidayMultiplier > 1) surge *= 1.3; // 30% surge on holidays
    if (demandMultiplier > 1) surge *= 1.2; // 20% surge on weekends
    
    return Math.min(surge, 2.5); // Cap at 2.5x surge
  }
  
  // Traditional modes have moderate variation
  if (['auto-rickshaw', 'taxi'].includes(mode)) {
    return demandMultiplier * (holidayMultiplier > 1 ? 1.2 : 1.0);
  }
  
  // Public transport has minimal variation
  return 1.0;
}

// Calculate fare for a specific transport mode
export function calculateFare(
  mode: TransportMode,
  distance: number,
  time?: string
): TransportFare {
  const baseRate = BASE_RATES[mode];
  const surgeMultiplier = getSurgeMultiplier(mode, time);
  
  // Calculate base fare
  let fare = baseRate.baseFare + (distance * baseRate.perKm);
  
  // Apply surge
  fare *= surgeMultiplier;
  
  // Ensure minimum fare
  fare = Math.max(fare, baseRate.minFare);
  
  // Round to nearest 10
  fare = Math.round(fare / 10) * 10;
  
  // Calculate estimated time (average 25 km/h in cities, 40 km/h highways)
  const avgSpeed = distance < 10 ? 25 : 40;
  const estimatedMinutes = Math.round((distance / avgSpeed) * 60);
  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = estimatedMinutes % 60;
  const estimatedTime = hours > 0 
    ? `${hours}h ${minutes}min` 
    : `${minutes} min`;
  
  // Determine availability based on mode and conditions
  let availability: 'high' | 'medium' | 'low' = 'high';
  if (['metro', 'local-bus'].includes(mode)) {
    availability = 'high';
  } else if (['ola-mini', 'uber-go', 'app-bike'].includes(mode)) {
    availability = surgeMultiplier > 1.5 ? 'medium' : 'high';
  } else if (['taxi', 'auto-rickshaw'].includes(mode)) {
    availability = 'medium';
  } else if (['rental-car', 'flight'].includes(mode)) {
    availability = distance > 20 ? 'high' : 'low';
  }
  
  // Get description
  const descriptions: Record<TransportMode, string> = {
    'metro': 'Fast, reliable, and eco-friendly. No traffic delays.',
    'auto-rickshaw': 'Classic Indian transport. Meter rates may vary.',
    'taxi': 'Comfortable with AC. Good for families.',
    'ola-mini': 'Budget-friendly cab. AC included.',
    'ola-sedan': 'Comfortable sedan. Good for luggage.',
    'uber-go': 'Affordable rides. Wide availability.',
    'uber-premier': 'Premium comfort. Professional drivers.',
    'local-bus': 'Most economical option. May be crowded.',
    'app-bike': 'Quick for short distances. Beat traffic.',
    'rental-car': 'Full day at your disposal. Includes driver.',
    'train': 'Scenic and economical for long distances.',
    'flight': 'Fastest for long distances. Book in advance.',
    'none': 'Walking distance',
  };
  
  return {
    mode,
    baseFare: baseRate.baseFare,
    perKmRate: baseRate.perKm,
    minimumFare: baseRate.minFare,
    estimatedFare: fare,
    estimatedTime,
    availability,
    description: descriptions[mode],
  };
}

// Get recommended transport modes based on distance and time
export function getRecommendedTransport(
  from: string,
  to: string,
  distance: number,
  time?: string
): TransportRoute {
  const estimatedDuration = Math.round((distance / 30) * 60); // Rough estimate
  
  const options: TransportFare[] = [];
  
  // Short distance (< 3 km)
  if (distance < 3) {
    options.push(calculateFare('app-bike', distance, time));
    options.push(calculateFare('auto-rickshaw', distance, time));
    options.push(calculateFare('uber-go', distance, time));
  }
  // Medium distance (3-15 km)
  else if (distance < 15) {
    options.push(calculateFare('metro', distance, time));
    options.push(calculateFare('auto-rickshaw', distance, time));
    options.push(calculateFare('uber-go', distance, time));
    options.push(calculateFare('ola-mini', distance, time));
    options.push(calculateFare('local-bus', distance, time));
  }
  // Long distance (15-50 km)
  else if (distance < 50) {
    options.push(calculateFare('uber-go', distance, time));
    options.push(calculateFare('ola-sedan', distance, time));
    options.push(calculateFare('taxi', distance, time));
    options.push(calculateFare('rental-car', distance, time));
    options.push(calculateFare('train', distance, time));
  }
  // Very long distance (> 50 km)
  else {
    options.push(calculateFare('rental-car', distance, time));
    options.push(calculateFare('train', distance, time));
    options.push(calculateFare('flight', distance, time));
  }
  
  // Sort by fare (cheapest first)
  options.sort((a, b) => a.estimatedFare - b.estimatedFare);
  
  return {
    from,
    to,
    distance,
    estimatedDuration,
    options,
  };
}

// Calculate distance between two locations (simplified - in real app use Google Maps API)
export function estimateDistance(from: string, to: string): number {
  // This is a mock calculation. In production, use Google Maps Distance Matrix API
  // For now, return a random distance between 2-30 km
  const hash = (from + to).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Math.max(2, (hash % 28) + 2);
}

// Get transport between activities
export function getTransportBetweenActivities(
  fromLocation: string,
  toLocation: string,
  time?: string
): TransportRoute {
  const distance = estimateDistance(fromLocation, toLocation);
  return getRecommendedTransport(fromLocation, toLocation, distance, time);
}

// Format fare for display
export function formatFare(fare: number): string {
  return `₹${fare.toLocaleString('en-IN')}`;
}

// Get surge pricing badge
export function getSurgeBadge(mode: TransportMode, time?: string): string | null {
  const multiplier = getSurgeMultiplier(mode, time);
  
  if (multiplier >= 2.0) return 'Very High Demand';
  if (multiplier >= 1.5) return 'High Demand';
  if (multiplier > 1.2) return 'Moderate Demand';
  
  return null;
}

// Calculate total transport cost for a day
export function calculateDayTransportCost(activities: any[]): number {
  let totalCost = 0;
  
  for (let i = 0; i < activities.length - 1; i++) {
    const current = activities[i];
    const next = activities[i + 1];
    
    if (current.location && next.location) {
      const distance = estimateDistance(current.location, next.location);
      // Use Uber Go as default for estimation
      const fare = calculateFare('uber-go', distance, next.time);
      totalCost += fare.estimatedFare;
    }
  }
  
  return totalCost;
}

// Get cheapest transport option
export function getCheapestOption(options: TransportFare[]): TransportFare {
  return options.reduce((cheapest, current) => 
    current.estimatedFare < cheapest.estimatedFare ? current : cheapest
  );
}

// Get fastest transport option
export function getFastestOption(options: TransportFare[]): TransportFare {
  return options.reduce((fastest, current) => {
    const fastestMinutes = parseTimeToMinutes(fastest.estimatedTime);
    const currentMinutes = parseTimeToMinutes(current.estimatedTime);
    return currentMinutes < fastestMinutes ? current : fastest;
  });
}

// Helper to parse time string to minutes
function parseTimeToMinutes(timeStr: string): number {
  const hourMatch = timeStr.match(/(\d+)h/);
  const minuteMatch = timeStr.match(/(\d+)\s*min/);
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  
  return hours * 60 + minutes;
}

// Get availability color for UI
export function getAvailabilityColor(availability: 'high' | 'medium' | 'low'): string {
  switch (availability) {
    case 'high': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-red-600';
    default: return 'text-gray-600';
  }
}
