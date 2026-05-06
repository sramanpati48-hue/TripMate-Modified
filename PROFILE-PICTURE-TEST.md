# Profile Picture Upload - Testing Guide

## Quick Start Test

### 1. Upload Your Profile Picture
1. Log in to the app
2. Go to **Profile** page (click profile icon in navbar)
3. Click the **camera icon** on your avatar in the header
4. Dialog opens - click **"Upload Picture"** button
5. Select an image file from your device (JPG, PNG, GIF, WebP)
6. Click the upload button or just wait - it uploads automatically
7. Toast notification confirms success
8. Your avatar updates instantly on the page

### 2. Verify Display in Chat
1. Go to **Matchmaker** section
2. View one of your travel matches or send a new travel request
3. Once matched, go to **Chat** page
4. Your profile picture appears next to your messages
5. Partner's uploaded picture appears in the partner list and their messages

## What to Test

### File Upload
- ✓ Upload JPEG image
- ✓ Upload PNG image  
- ✓ Upload GIF image
- ✓ Upload WebP image
- ✗ Try uploading a non-image file (should fail)
- ✗ Try uploading a file larger than 5MB (should fail)

### Display
- ✓ Avatar shows in profile page
- ✓ Avatar shows in chat partner list
- ✓ Avatar shows in chat message bubbles
- ✓ Avatar persists after page refresh
- ✓ Other users see your uploaded picture

### UI/UX
- ✓ Camera icon is visible and clickable
- ✓ Modal dialog appears on click
- ✓ File input works
- ✓ Loading spinner shows during upload
- ✓ Error messages display for invalid files
- ✓ Success toast appears after upload

## Database Check

The avatar is stored as a base64 data URL in the User table:

```sql
-- Check user avatar
SELECT id, name, avatar 
FROM User 
WHERE id = 'your-user-id'
LIMIT 1;

-- Avatar field should look like:
-- data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
```

## Technical Details

### API Response Format
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

### Browser Compatibility
- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- Mobile browsers: ✓ Full support

## Troubleshooting

### Image Not Uploading
- Check file format (must be JPEG, PNG, WebP, or GIF)
- Check file size (must be under 5MB)
- Check browser console for error messages
- Verify authentication token is valid

### Avatar Not Showing in Chat
- Refresh the chat page
- Clear browser cache
- Verify the partner has accepted the travel request
- Check browser console for errors

### Base64 Data URL Issues
- Some old browsers may have size limits on data URLs
- Consider switching to external storage (Cloudinary, S3) if needed

## Limitations & Future Improvements

### Current Limitations
- Base64 storage increases database size
- Large images stored as data URLs may impact performance
- Not optimized for very large user bases

### Future Improvements
- Use Cloudinary/AWS S3 for storage
- Implement image compression before upload
- Add image cropping tool
- Support multiple profile pictures
- Add image filters/effects

## Files Involved

```
app/
  ├── api/user/upload-avatar/route.ts     (API endpoint)
  └── profile/page.tsx                    (Profile page with modal)

components/
  └── avatar-upload.tsx                   (Upload component)

lib/
  └── auth.ts                             (sanitizeUser function)

prisma/
  └── schema.prisma                       (User.avatar field)
```

## Demo Scenario

1. Create two accounts (Alice and Bob)
2. Alice uploads a profile picture (e.g., her photo)
3. Bob uploads a different profile picture
4. Alice finds Bob in Matchmaker
5. Alice sends a travel request to Bob
6. Bob accepts the request
7. They both go to Chat
8. Both see each other's uploaded profile pictures
9. They can chat with their pictures visible

This demonstrates the complete flow of the profile picture upload feature!
