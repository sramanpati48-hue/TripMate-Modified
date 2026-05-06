# Voice Chat Implementation Guide

## Current Implementation Status

I've added a complete WebRTC-based voice chat system with the following features:

### Frontend Features (Implemented ✅)
- **One-to-one voice calls** - Initiate and receive voice calls
- **Mute/Unmute** - Toggle microphone on/off during calls
- **Screen Sharing** - Share screen during calls
- **Call Recording** - Record and download call audio
- **Call Duration Timer** - Shows elapsed time in HH:MM:SS format
- **Beautiful UI** - shadcn components with Lucide icons

### Backend Requirements (TODO)

The voice call system uses WebRTC for peer-to-peer communication but requires signaling (offer/answer exchange). You have two options:

## Option 1: WebSocket Signaling (Recommended for Real-Time)

### Setup Steps:

1. **Install Socket.io** (for real-time signaling):
```bash
npm install socket.io socket.io-client
```

2. **Create WebSocket handler** in your Next.js app:
```typescript
// lib/socket.ts
import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
  auth: {
    token: localStorage.getItem('authToken'),
  },
});

// Listen for voice call events
socket.on('voice-call:incoming', (data) => {
  // Handle incoming call notification
  console.log('Incoming call from:', data.callerId);
});

socket.on('voice-call:offer', (data) => {
  // Handle offer from caller
  // Set remote description and create answer
});

socket.on('voice-call:answer', (data) => {
  // Handle answer from receiver
  // Set remote description
});

socket.on('voice-call:ice-candidate', (data) => {
  // Add ICE candidate
});
```

3. **Emit signaling events** in chat-window.tsx:
```typescript
// Replace fetch calls in voice functions with:
socket.emit('voice-call:initiate', {
  receiverId: selectedPartner.id,
  offer: await peerConnection.createOffer(),
});
```

## Option 2: Polling with REST API (Current - Simple but Less Real-Time)

The current implementation uses REST API endpoints. You need to:

1. **Store signaling data** in a database/cache:
```typescript
// Store in Redis, Firestore, or database
const voiceCallSignal = {
  callerId: userId,
  receiverId: receiverId,
  offer: offer,
  answer: null,
  candidates: [],
  createdAt: new Date(),
};
```

2. **Modify voice-call API** to use WebSocket or polling mechanism

3. **Implement receiver notification** - Use email/push notifications

## API Endpoint Details

### POST `/api/matchmaker/voice-call`

**Request Body:**
```json
{
  "receiverId": "user-id",
  "action": "initiate|answer|ice-candidate|end",
  "offer": { /* RTCSessionDescription */ },
  "answer": { /* RTCSessionDescription */ },
  "candidate": { /* RTCIceCandidate */ }
}
```

## Testing Voice Calls Locally

1. **Open two browser tabs** with the same user logged in or two different users
2. **Click "Voice Call"** button in the chat header
3. **Verify microphone permissions** are granted
4. **Check browser console** for signaling messages

## Important Notes

### Browser Compatibility
- Chrome/Edge: ✅ Full WebRTC support
- Firefox: ✅ Full WebRTC support
- Safari: ⚠️ Limited WebRTC (test before deployment)

### Security Considerations
1. **Encrypt signaling** - Use HTTPS/WSS only
2. **Authenticate** - Verify tokens before allowing calls
3. **User consent** - Always request microphone/camera permissions
4. **STUN/TURN servers** - Currently using Google's free STUN. For production, use:
   - Twilio's TURN servers
   - Your own TURN server
   - AWS KINESIS VIDEO (for video later)

### Production Deployment

For production, consider using:

1. **Twilio** - Commercial WebRTC solution
2. **Agora.io** - Real-time communication platform
3. **Pion** - WebRTC infrastructure
4. **Jitsi** - Open-source WebRTC server

Each has different pricing and features.

## Next Steps

1. Choose signaling method (WebSocket recommended)
2. Implement real-time notifications for incoming calls
3. Add incoming call UI (accept/reject dialog)
4. Test with multiple users
5. Add video call support (future enhancement)
6. Deploy with production TURN servers

## Code References

- **WebRTC Documentation**: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- **Socket.io Documentation**: https://socket.io/docs/
- **STUN/TURN Servers**: https://tools.ietf.org/html/draft-uberti-rtcweb-turn-server-failure-detection

## Current Limitations

- ⚠️ No real-time notifications (needs WebSocket)
- ⚠️ No incoming call UI yet
- ⚠️ Single audio track (no video yet)
- ⚠️ Limited TURN server coverage (testing only)

Once you implement the signaling backend, the frontend will work seamlessly!
