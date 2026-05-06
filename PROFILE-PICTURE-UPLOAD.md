# Profile Picture Upload Feature

## Overview
Users can now upload profile pictures directly from their device instead of pasting image URLs. Profile pictures are displayed in the chat interface so travel companions can see each other's photos.

## Features

### 1. Profile Picture Upload
- **Location**: Profile page (click the camera icon on your avatar)
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Max file size**: 5MB
- **Storage**: Images are converted to base64 and stored in the database

### 2. Display in Chat
- Profile pictures automatically appear in conversations
- Shows avatars in the partner list
- Displays avatars in message bubbles

## How It Works

### Upload Process
1. Go to **Profile** page
2. Click the **camera icon** on your avatar
3. A dialog opens with the **AvatarUpload** component
4. Click **"Upload Picture"** button
5. Select an image from your device
6. Image preview shows before upload
7. Click upload to confirm
8. Picture is instantly stored and displayed

### Technical Details

#### API Endpoint: `POST /api/user/upload-avatar`
- **Authentication**: Required (Bearer token)
- **Request**: FormData with `file` field
- **Response**: Updated user with avatar data URL
- **Validation**:
  - File type: JPEG, PNG, WebP, GIF only
  - File size: Max 5MB
  - Stored as base64 data URL in database

#### Component: `AvatarUpload`
- **Location**: `components/avatar-upload.tsx`
- **Features**:
  - File validation (type & size)
  - Image preview before upload
  - Upload progress indicator
  - Error handling with toast notifications
  - Supports 3 sizes: sm, md, lg

#### Database Update
- Field: `User.avatar` (String)
- Format: Base64 data URL (e.g., `data:image/jpeg;base64,...`)
- Updated via API when user uploads image

### Usage Example

```typescript
// In your component
import { AvatarUpload } from "@/components/avatar-upload"

export function MyComponent() {
  const [avatar, setAvatar] = useState(user.avatar)
  
  return (
    <AvatarUpload 
      currentAvatar={avatar}
      userName={user.name}
      size="lg"
      onAvatarChange={(newAvatar) => setAvatar(newAvatar)}
    />
  )
}
```

## Integration Points

### Profile Page (`app/profile/page.tsx`)
- Avatar upload modal
- Uses AvatarUpload component
- Updates user state on successful upload

### Chat Window (`components/chat-window.tsx`)
- Displays partner avatars (automatically from database)
- Shows uploaded profile pictures in conversations
- No changes needed - works automatically with uploaded avatars

### API Routes
- `POST /api/user/upload-avatar` - Upload and store avatar
- `GET /api/matchmaker/chat` - Returns partner with avatar data
- `GET /api/user/profile` - Returns user with avatar

## What's Changed

### New Files
- `app/api/user/upload-avatar/route.ts` - Upload endpoint
- `components/avatar-upload.tsx` - Upload component

### Modified Files
- `app/profile/page.tsx` - Replaced URL input with file upload
- `prisma/schema.prisma` - No changes (avatar field already exists)

## Notes

- Images are stored as base64 data URLs in the database
- No external storage service needed
- Profile pictures display immediately in chat
- Works with all browsers supporting File API
- Responsive design for mobile and desktop
