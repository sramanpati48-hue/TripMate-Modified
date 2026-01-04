# Backend Setup Documentation

## Overview
This backend system handles user authentication, profile management, and data storage for the Travel App.

## Tech Stack
- **Framework**: Next.js App Router API Routes
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Custom validation functions

## Database Schema

### User Model
```prisma
- id: String (cuid)
- email: String (unique)
- password: String (hashed)
- name: String
- phone: String (optional)
- avatar: String (optional)
- dateOfBirth: DateTime (optional)
- gender: String (optional)
- nationality: String (optional)
- address, city, country: String (optional)
- preferences: JSON (optional)
- createdAt, updatedAt: DateTime
```

### Relations
- User → Trips (one-to-many)
- User → Favorites (one-to-many)
- User → Reviews (one-to-many)
- User → Bookings (one-to-many)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install prisma @prisma/client bcryptjs jose
npm install -D @types/bcryptjs
```

### 2. Set Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update the following variables:
- `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: A strong secret key (min 32 characters)

### 3. Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Database Migration (Production)
```bash
npx prisma migrate dev --name init
```

## API Endpoints

### Authentication

#### 1. **POST /api/auth/signup**
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "+1234567890" // optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "createdAt": "2025-12-13T...",
      "updatedAt": "2025-12-13T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `409`: Email already registered
- `500`: Server error

#### 2. **POST /api/auth/login**
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `401`: Invalid credentials
- `500`: Server error

### User Profile

#### 3. **GET /api/user/profile**
Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "avatar": "https://...",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "nationality": "US",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "preferences": { /* JSON */ }
  }
}
```

**Error Responses:**
- `401`: Unauthorized (invalid/missing token)
- `500`: Server error

#### 4. **PATCH /api/user/profile**
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (all fields optional):**
```json
{
  "name": "John Smith",
  "phone": "+1987654321",
  "avatar": "https://...",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "nationality": "US",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "country": "USA",
  "preferences": {
    "travelStyle": "adventure",
    "budget": "mid-range",
    "interests": ["hiking", "food", "culture"]
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- (Optional) Special character

## Security Features
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Input validation and sanitization
- ✅ SQL injection protection (Prisma)
- ✅ Sensitive data removed from responses
- ✅ HTTPS recommended for production

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "city": "New City"
  }'
```

## Testing with Postman
1. Import the API endpoints
2. For authenticated routes, add header: `Authorization: Bearer <token>`
3. Token is received after successful signup/login

## Database Management

### View Data
```bash
npx prisma studio
```
Opens a web interface at http://localhost:5555

### Reset Database
```bash
npx prisma db push --force-reset
```

### Generate Client After Schema Changes
```bash
npx prisma generate
```

## Production Deployment Checklist
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set `DATABASE_URL` to production database
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Enable HTTPS
- [ ] Set up CORS if needed
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Enable email verification (optional)
- [ ] Set up password reset flow (optional)

## Common Issues

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npx prisma generate
```

### Issue: "Database connection error"
**Solution:** Check DATABASE_URL in .env.local

### Issue: "JWT verification failed"
**Solution:** Check JWT_SECRET matches in .env.local

## File Structure
```
showcase-x-travel-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── lib/
│   ├── auth.ts                # Auth utilities
│   └── prisma.ts              # Prisma client
├── app/
│   └── api/
│       ├── auth/
│       │   ├── signup/
│       │   │   └── route.ts   # Signup endpoint
│       │   └── login/
│       │       └── route.ts   # Login endpoint
│       └── user/
│           └── profile/
│               └── route.ts   # Profile endpoints
└── .env.local                 # Environment variables
```

## Next Steps
1. Install required packages
2. Set up environment variables
3. Initialize database
4. Test API endpoints
5. Integrate with frontend forms
6. Add email verification (optional)
7. Add password reset (optional)
8. Deploy to production
