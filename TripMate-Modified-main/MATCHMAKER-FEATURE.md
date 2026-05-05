# Matchmaker Feature - Documentation

## Overview
The Matchmaker feature allows users to find and connect with travel companions based on shared preferences, interests, and travel styles.

## Features

### 1. Travel Profile
Users can create and manage their travel profile with:
- **Gender & Preferences**: Select your gender and preferred travel companion gender
- **Travel Style**: Adventure, Relaxation, Cultural, Luxury, Budget, or Backpacker
- **Group Preference**: Solo, Group, or Flexible
- **Interests**: Hiking, Photography, Food, Nightlife, Beach, Museums, etc.
- **Destinations**: Add places you want to visit
- **Languages**: List languages you speak
- **Bio**: Personal introduction and travel preferences
- **Age Range**: 18-25, 26-35, 36-45, 46+

### 2. Smart Matching Algorithm
The system calculates compatibility scores based on:
- **Travel Style Match**: +30 points for same style
- **Group Preference Match**: +20 points for same preference
- **Shared Interests**: +5 points per shared interest (max 50 points)

Results are sorted by compatibility score (highest first).

### 3. Advanced Filters
Filter matches by:
- **Gender Preference**: Male, Female, Non-binary, Any
- **Travel Type**: Solo, Group, or Any
- **Travel Style**: Filter by specific style
- **Destination**: Search by location

### 4. Travel Requests
Send personalized travel requests with:
- **Message**: Introduce yourself
- **Destination**: Propose a destination
- **Dates**: Suggest travel dates
- **Status Tracking**: Pending, Accepted, Rejected, Cancelled

## Database Schema

### TravelProfile Model
```prisma
model TravelProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  
  gender            String?
  preferredGender   String?
  travelStyle       String?
  groupPreference   String   @default("any")
  groupSize         String?
  interests         String?  // JSON array
  destinations      String?  // JSON array
  languages         String?  // JSON array
  availability      String?  // JSON
  bio               String?
  ageRange          String?
  isActive          Boolean  @default(true)
  verified          Boolean  @default(false)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### TravelMatchRequest Model
```prisma
model TravelMatchRequest {
  id                String   @id @default(cuid())
  senderId          String
  sender            User     @relation("SentRequests")
  receiverId        String
  receiver          User     @relation("ReceivedRequests")
  
  message           String?
  destination       String?
  startDate         DateTime?
  endDate           DateTime?
  status            String   @default("pending")
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([senderId, receiverId, destination])
}
```

## API Endpoints

### Profile Management

#### POST /api/matchmaker/profile
Create or update travel profile
```json
{
  "gender": "male",
  "preferredGender": "any",
  "travelStyle": "adventure",
  "groupPreference": "any",
  "interests": ["Hiking", "Photography"],
  "destinations": ["Bali", "Nepal"],
  "languages": ["English", "Spanish"],
  "bio": "Love adventure travel!",
  "ageRange": "26-35",
  "isActive": true
}
```

#### GET /api/matchmaker/profile
Fetch user's travel profile
- Requires: Bearer token
- Returns: Profile with parsed JSON fields

### Matching

#### GET /api/matchmaker/matches
Find compatible travel companions
- Query Parameters:
  - `gender`: Filter by gender
  - `groupPreference`: solo/group/any
  - `travelStyle`: Filter by style
  - `destination`: Search destination
- Returns: Array of matches with compatibility scores

### Requests

#### GET /api/matchmaker/requests
Fetch travel requests
- Query Parameters:
  - `type`: all/sent/received
- Returns: Sent and received requests

#### POST /api/matchmaker/requests
Send travel request
```json
{
  "receiverId": "user_id",
  "message": "Hey! Want to travel together?",
  "destination": "Bali, Indonesia",
  "startDate": "2024-06-01",
  "endDate": "2024-06-15"
}
```

#### PATCH /api/matchmaker/requests
Update request status
```json
{
  "requestId": "request_id",
  "status": "accepted" // or "rejected", "cancelled"
}
```

#### DELETE /api/matchmaker/requests?id={requestId}
Delete a request

## UI Components

### 1. MatchmakerPage (`/matchmaker`)
Main page with three tabs:
- **Matches**: Browse compatible travelers
- **Sent**: View sent requests
- **Received**: Manage incoming requests

### 2. TravelProfileCard
Displays user profile with:
- Avatar and location
- Compatibility score badge
- Travel style and preferences
- Shared interests highlighted
- Connect button

### 3. MatchFilters
Filter controls for:
- Gender preference
- Travel type (solo/group)
- Travel style
- Destination search

### 4. TravelRequestDialog
Modal to send requests with:
- Personal message
- Proposed destination
- Travel dates
- Form validation

### 5. CreateProfileDialog
Form to create/edit profile:
- Required fields: Gender, Travel Style
- Multiple interests selection
- Dynamic destination/language tags
- Bio textarea

## User Flow

### First Time User
1. Navigate to `/matchmaker`
2. See welcome screen
3. Click "Create Travel Profile"
4. Fill in profile information
5. View matched travelers

### Finding Travel Companions
1. Browse matches on "Matches" tab
2. Use filters to refine results
3. Click "Connect" on a profile card
4. Send personalized travel request
5. Track request status in "Sent" tab

### Receiving Requests
1. Check "Received" tab for incoming requests
2. View sender's profile and message
3. Click "Accept" or "Decline"
4. Connect for trip planning

## Security Features
- All endpoints require JWT authentication
- Users can only update their own profile
- Request authorization checks (sender/receiver validation)
- Duplicate request prevention
- SQL injection protection via Prisma

## Future Enhancements
- [ ] In-app messaging system
- [ ] Verified traveler badges
- [ ] Trip planning collaboration
- [ ] Group trip formation
- [ ] Review system for past travel companions
- [ ] Video profile introductions
- [ ] Real-time notifications
- [ ] Mobile app integration

## Navigation
Access Matchmaker from:
- Navbar: "Find Travel Buddies" link
- URL: `/matchmaker`

## Testing Checklist
- [ ] Create travel profile
- [ ] Edit existing profile
- [ ] Browse matches
- [ ] Apply filters
- [ ] Send travel request
- [ ] Receive request notification
- [ ] Accept/reject requests
- [ ] View compatibility scores
- [ ] Check profile validation

## Support
For issues or questions:
- Check console logs for errors
- Verify authentication token
- Ensure profile is created before browsing
- Check API endpoint responses
