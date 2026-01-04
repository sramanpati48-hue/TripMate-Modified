# Transport & Fare Integration - Trip Planner

## Overview
The Trip Planner now includes comprehensive transport fare calculation and real-time pricing for various transport modes across India. This feature helps travelers plan and budget their transportation costs accurately.

## Features Implemented

### 1. **Transport Service** (`lib/transport-service.ts`)
A complete transport fare calculation system with:
- **Multiple Transport Modes**:
  - Metro
  - Auto-rickshaw
  - Taxi (traditional)
  - Ola Mini & Sedan
  - Uber Go & Premier
  - Local Bus
  - App-based Bike (Rapido/Ola Bike)
  - Rental Car (full day)
  - Train
  - Flight

- **Real-time Pricing Factors**:
  - Base fare + per-km rates
  - Surge pricing during peak hours (7-10 AM, 5-9 PM)
  - Weekend multipliers (+20%)
  - Holiday surcharges (+50%)
  - Seasonal variations
  - Distance-based recommendations

- **Smart Features**:
  - Automatic mode recommendations based on distance
  - Availability indicators (high/medium/low)
  - Estimated travel time calculation
  - Surge badges and alerts
  - Cheapest and fastest option identification

### 2. **Updated Components**

#### **TripDayCard** (`components/trip-day-card.tsx`)
- Displays transport information between activities
- Shows transport mode, distance, and fare
- Visual indicators with icons for easy identification
- Integrated seamlessly between activity cards

#### **AddActivityDialog** (`components/add-activity-dialog.tsx`)
- Transport mode selection dropdown
- Distance input field
- Real-time fare calculation as you type
- Shows previous location for context
- Dynamic fare updates based on time and mode

#### **AIItineraryCard** (`components/ai-itinerary-card.tsx`)
- Displays transport details in AI-generated itineraries
- Shows recommended transport between activities
- Cost breakdown included
- Visual transport indicators

#### **TripSummary** (`components/trip-summary.tsx`)
- Overall trip statistics
- Total transport cost across all days
- Number of transport rides
- Most used transport mode
- Cost-saving tips

#### **TransportOptions** (`components/transport-options.tsx`)
- Comprehensive transport comparison view
- Shows all available options sorted by price
- Highlights cheapest option
- Displays surge pricing alerts
- Availability indicators
- Detailed descriptions for each mode

### 3. **Trip Planner Page Updates**
- Integrated TripSummary component
- Passes previous location to AddActivityDialog
- Real-time cost tracking
- Enhanced user experience with transport visibility

## Pricing Examples

### Short Distance (< 3 km)
- **App Bike**: ₹25-35 (fastest)
- **Auto-rickshaw**: ₹40-60
- **Uber Go**: ₹50-70

### Medium Distance (3-15 km)
- **Local Bus**: ₹10-25 (cheapest)
- **Metro**: ₹20-60 (if available)
- **Uber Go**: ₹80-150
- **Ola Mini**: ₹90-160

### Long Distance (15-50 km)
- **Uber Go**: ₹300-600
- **Taxi**: ₹400-800
- **Rental Car**: ₹2,500-3,500/day

### Very Long Distance (> 50 km)
- **Train**: ₹100-500 (most economical)
- **Rental Car**: ₹2,500-4,000/day
- **Flight**: ₹3,000-8,000+

## Surge Pricing

### Peak Hours Multiplier
- Morning: 7:00 AM - 10:00 AM → +50%
- Evening: 5:00 PM - 9:00 PM → +50%

### Special Conditions
- **Weekends**: +20% for app-based cabs
- **Holidays**: +30-50% for all modes
- **Monsoon Season**: -30% (off-season discount)
- **Maximum Surge Cap**: 2.5x base fare

## User Benefits

1. **Accurate Budgeting**: Know exact transport costs before traveling
2. **Cost Comparison**: Compare all available transport options
3. **Time Optimization**: See estimated travel times
4. **Smart Recommendations**: Get mode suggestions based on distance
5. **Real-time Updates**: Prices adjust based on current conditions
6. **Surge Alerts**: Be warned about high-demand pricing
7. **Trip Overview**: See total transport costs at a glance

## Usage Flow

### Manual Trip Planning
1. Add an activity to your itinerary
2. Select transport mode to next activity
3. Enter estimated distance
4. View real-time fare calculation
5. Activity saved with transport details
6. Transport info displayed between activities
7. View total costs in Trip Summary

### AI-Generated Itinerary
1. Generate itinerary with AI
2. Transport automatically included between activities
3. Real-time fares calculated for each leg
4. Total transport cost visible
5. Can modify transport modes as needed

## Technical Implementation

### Fare Calculation Formula
```typescript
finalFare = (baseFare + distance * perKmRate) * surgeMultiplier
finalFare = max(finalFare, minimumFare)
finalFare = round(finalFare / 10) * 10  // Round to nearest ₹10
```

### Surge Multiplier Calculation
```typescript
surge = 1.0
if (isPeakHour) surge *= 1.5
if (isHoliday) surge *= 1.3
if (isWeekend) surge *= 1.2
surge = min(surge, 2.5)  // Cap at 2.5x
```

### Distance-based Recommendations
- **0-3 km**: Bike, Auto, Uber Go
- **3-15 km**: Metro, Bus, Ola Mini, Auto
- **15-50 km**: Uber, Taxi, Rental Car, Train
- **50+ km**: Train, Flight, Rental Car

## Future Enhancements (Potential)

1. **Google Maps Integration**
   - Real distance calculation using Maps API
   - Live traffic updates
   - Actual route planning

2. **Live Fare APIs**
   - Integration with Uber/Ola APIs
   - Real-time availability checks
   - Direct booking links

3. **Multi-modal Transport**
   - Combined journey options (Metro + Auto)
   - Transfer time calculation
   - Optimal route suggestions

4. **Historical Data**
   - Track actual spending
   - Compare estimates vs. actuals
   - Budget optimization suggestions

5. **Group Travel**
   - Per-person cost calculation
   - Carpooling recommendations
   - Bulk booking discounts

## Cost Comparison Example

**Example Route: India Gate → Qutub Minar (15 km)**

| Mode | Fare | Time | Availability |
|------|------|------|--------------|
| Local Bus | ₹20 | 45 min | High |
| Metro | ₹40 | 35 min | High |
| Auto-rickshaw | ₹200 | 40 min | Medium |
| Uber Go | ₹180 | 30 min | High |
| Ola Mini | ₹160 | 30 min | High |
| Taxi | ₹270 | 30 min | Medium |

**During Peak Hours (6 PM):**
- Uber Go: ₹270 (+50% surge)
- Ola Mini: ₹240 (+50% surge)
- Auto/Taxi: Same prices (fixed rates)
- Metro/Bus: Same prices (no surge)

## Best Practices for Users

1. **Book in Advance**: Avoid surge pricing during peak hours
2. **Check Alternatives**: Compare multiple transport modes
3. **Use Public Transport**: Save up to 80% on costs
4. **Plan Off-Peak**: Travel during non-peak hours when possible
5. **Group Sharing**: Share cabs for longer distances
6. **Pre-book Rentals**: Daily rentals cheaper than multiple rides
7. **Metro Over Cabs**: For medium distances with metro connectivity

## API Reference

### Key Functions

```typescript
// Calculate fare for specific mode
calculateFare(mode: TransportMode, distance: number, time?: string): TransportFare

// Get recommended transport options
getRecommendedTransport(from: string, to: string, distance: number, time?: string): TransportRoute

// Get transport mode display name
getTransportModeName(mode: TransportMode): string

// Format fare for display
formatFare(fare: number): string

// Get surge pricing badge
getSurgeBadge(mode: TransportMode, time?: string): string | null

// Calculate total transport cost for a day
calculateDayTransportCost(activities: Activity[]): number
```

## Conclusion

The transport and fare integration provides travelers with comprehensive, real-time pricing information to make informed decisions about their transportation options. The system accounts for various factors affecting prices and presents information in an easy-to-understand format, helping users plan and budget their trips effectively.
