"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  MessageSquare,
  ArrowLeft,
  Loader2,
  MapPin,
  ShieldAlert,
  X,
  Check,
  CheckCheck,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
} from "lucide-react";

interface ChatPartner {
  id: string;
  name: string;
  avatar: string | null;
  city: string | null;
  country: string | null;
  lastMessage: string | null;
  lastMessageTime: string;
  unreadCount: number;
  destination: string | null;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string | null;
  read: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  initialPartnerId?: string | null;
}

type ChatTheme = 'default' | 'ocean' | 'sunset' | 'forest' | 'sunflower' | 'coastal';

const THEME_STYLES: Record<ChatTheme, { button: string, text: string, ownBubble: string, partnerBubble: string, ownText: string, partnerText: string, bgImage: string }> = {
  default: { button: 'bg-primary text-primary-foreground', text: 'Default', ownBubble: 'bg-primary text-primary-foreground shadow-lg', partnerBubble: 'bg-gray-700 text-gray-100 shadow-lg backdrop-blur-sm', ownText: 'text-primary-foreground', partnerText: 'text-gray-100', bgImage: '' },
  ocean: { button: 'bg-blue-600', text: 'Ocean', ownBubble: 'bg-blue-600 text-white shadow-lg', partnerBubble: 'bg-white/95 text-blue-900 border border-blue-200 shadow-lg', ownText: 'text-white', partnerText: 'text-blue-900', bgImage: '/themes/ocean.jfif' },
  sunset: { button: 'bg-yellow-500', text: 'Sunset', ownBubble: 'bg-yellow-500 text-white shadow-lg', partnerBubble: 'bg-white/95 text-yellow-900 border border-yellow-200 shadow-lg', ownText: 'text-white', partnerText: 'text-yellow-900', bgImage: '/themes/sunset.jfif' },
  forest: { button: 'bg-emerald-600', text: 'Forest', ownBubble: 'bg-emerald-600 text-white shadow-lg', partnerBubble: 'bg-emerald-100/95 text-emerald-900 border border-emerald-300 shadow-lg backdrop-blur-sm', ownText: 'text-white', partnerText: 'text-emerald-900', bgImage: '/themes/forest.jfif' },
  sunflower: { button: 'bg-amber-700', text: 'Sunflower', ownBubble: 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg', partnerBubble: 'bg-stone-100/95 text-stone-800 border border-stone-300 shadow-lg backdrop-blur-sm', ownText: 'text-white', partnerText: 'text-stone-800', bgImage: '/themes/sunflower.jfif' },
  coastal: { button: 'bg-blue-500', text: 'Coastal', ownBubble: 'bg-blue-500 text-blue-50 shadow-lg', partnerBubble: 'bg-gray-100/95 border border-gray-300 text-gray-900 shadow-lg', ownText: 'text-blue-50', partnerText: 'text-gray-900', bgImage: '/themes/coastal.jfif' }
};

export function ChatWindow({ initialPartnerId }: ChatWindowProps) {
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const [chatTheme, setChatTheme] = useState<ChatTheme>('default');
  const [bgImage, setBgImage] = useState<string>("");
  
  // Voice call states
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const recordingRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("chatTheme") as ChatTheme;
    if (savedTheme && THEME_STYLES[savedTheme]) {
      setChatTheme(savedTheme);
    }
  }, []);

  const generateAbstractBackground = async () => {
    try {
      const patterns = [
        "abstract geometric shapes with soft gradients, minimalist, modern",
        "flowing liquid colorful abstract pattern, smooth waves, ethereal",
        "scattered dots and lines forming abstract network pattern",
        "radial burst of colors with soft blur, minimalist abstract",
        "organic flowing shapes with pastel colors, fluid art style",
        "layered geometric triangles with gradient colors, modern",
        "abstract marble texture with swirled colors, elegant",
        "particle motion abstract pattern with glowing elements",
        "soft blurred bokeh circles, abstract light pattern",
        "concentric circles with gradient colors, hypnotic pattern"
      ];
      
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      // Generate image using Gemini's image capabilities
      const response = await fetch("/api/generate-bg-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: randomPattern })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setBgImage(data.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error generating background:", error);
    }
  };

  const handleThemeChange = (theme: ChatTheme) => {
    setChatTheme(theme);
    localStorage.setItem("chatTheme", theme);
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPartners = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/matchmaker/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners);

        // Auto-select initial partner if provided
        if (initialPartnerId && !selectedPartner) {
          const found = data.partners.find(
            (p: ChatPartner) => p.id === initialPartnerId
          );
          if (found) setSelectedPartner(found);
        }
      }
    } catch (error) {
      console.error("Error fetching chat partners:", error);
    } finally {
      setLoading(false);
    }
  }, [initialPartnerId, selectedPartner]);

  const fetchMessages = useCallback(async () => {
    if (!selectedPartner) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `/api/matchmaker/chat?partnerId=${selectedPartner.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedPartner]);

  // Initial load
  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Fetch messages when partner changes
  useEffect(() => {
    if (selectedPartner) {
      fetchMessages();
      inputRef.current?.focus();
    }
  }, [selectedPartner, fetchMessages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (selectedPartner) {
      pollingRef.current = setInterval(() => {
        fetchMessages();
        fetchPartners(); // refresh unread counts
      }, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedPartner, fetchMessages, fetchPartners]);

  const prevMessageCountRef = useRef(0);

  // Scroll to bottom only when new messages arrive
  useEffect(() => {
    if (messages.length !== prevMessageCountRef.current) {
      scrollToBottom();
      prevMessageCountRef.current = messages.length;
    }
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner || sendingMessage) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/matchmaker/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedPartner.id,
          content: newMessage.trim(),
          imageUrl: null,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        await fetchMessages();
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSelectPartner = (partner: ChatPartner) => {
    setSelectedPartner(partner);
    setMessages([]);
    setShowSafetyBanner(true); // reset banner for new chat
    generateAbstractBackground(); // Generate new background for this chat
  };

  // Helper for safety warning
  const containsContactInfo = (text: string) => {
    const phoneRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    return phoneRegex.test(text) || emailRegex.test(text);
  };
  const showWarning = containsContactInfo(newMessage);

  const SUGGESTED_TEXTS = [
    "Where are you traveling from?",
    "When is your trip?",
    "Have you booked flights yet?",
    "Would love to chat!",
  ];

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Voice call functions
  const startVoiceCall = async () => {
    if (!selectedPartner) return;
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
      });
      
      peerConnectionRef.current = peerConnection;
      
      // Add local stream
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
      
      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };
      
      // Emit voice call initiated signal to partner via API
      await fetch("/api/matchmaker/voice-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          receiverId: selectedPartner.id,
          action: "initiate",
          offer: await peerConnection.createOffer(),
        }),
      });
      
      setIsVoiceCallActive(true);
    } catch (error) {
      console.error("Error starting voice call:", error);
    }
  };

  const endVoiceCall = async () => {
    try {
      // Stop all tracks
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      
      // Close peer connection
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      localStreamRef.current = null;
      
      // Stop recording if active
      if (recordingRef.current && isRecording) {
        recordingRef.current.stop();
        setIsRecording(false);
      }
      
      // Stop screen sharing if active
      if (isScreenSharing) {
        setIsScreenSharing(false);
      }
      
      setIsVoiceCallActive(false);
      setCallDuration(0);
      
      // Notify partner
      if (selectedPartner) {
        await fetch("/api/matchmaker/voice-call", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            receiverId: selectedPartner.id,
            action: "end",
          }),
        });
      }
    } catch (error) {
      console.error("Error ending voice call:", error);
    }
  };

  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        
        // Get mic again
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        
        if (peerConnectionRef.current) {
          stream.getTracks().forEach(track => {
            peerConnectionRef.current?.addTrack(track, stream);
          });
        }
        
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: { cursor: 'always' },
          audio: false 
        });
        
        localStreamRef.current = screenStream;
        
        if (peerConnectionRef.current) {
          screenStream.getTracks().forEach(track => {
            peerConnectionRef.current?.addTrack(track, screenStream);
          });
        }
        
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  const startRecording = () => {
    if (remoteAudioRef.current?.srcObject) {
      const mediaStream = remoteAudioRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(mediaStream);
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice-call-${Date.now()}.webm`;
        a.click();
      };
      
      mediaRecorder.start();
      recordingRef.current = mediaRecorder;
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recordingRef.current) {
      recordingRef.current.stop();
      setIsRecording(false);
    }
  };

  // Call duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isVoiceCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isVoiceCallActive]);

  const formatCallDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No chats yet</h3>
          <p className="text-muted-foreground">
            Once you have accepted travel buddy requests, you can start chatting
            here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] flex-1 min-h-[600px] h-[calc(100vh-140px)] gap-6">
      {/* Partners sidebar */}
      <Card
        className={`overflow-hidden flex flex-col transition-all duration-300 ease-in-out bg-[#252526] border-gray-700/50 rounded-lg ${
          selectedPartner ? "hidden md:flex" : ""
        }`}
      >
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => handleSelectPartner(partner)}
                className={`w-full flex items-center gap-3 p-2 rounded-md transition-all text-left group ${
                  selectedPartner?.id === partner.id
                    ? "bg-gray-700/50"
                    : "hover:bg-gray-700/30"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={partner.avatar || ""} />
                    <AvatarFallback className="bg-gray-600 text-gray-300 font-semibold">
                      {partner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {partner.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {partner.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-sm truncate text-gray-200">
                      {partner.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatTime(partner.lastMessageTime)}
                    </span>
                  </div>
                  {partner.destination && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{partner.destination}</span>
                    </div>
                  )}
                  {partner.lastMessage && (
                    <p className={`text-xs mt-0.5 ${partner.unreadCount > 0 ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                      {truncateText(partner.lastMessage, 30)}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat area */}
      {selectedPartner ? (
        <Card className="flex flex-col overflow-hidden rounded-lg bg-[#252526] border-gray-700/50">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-700/50">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-gray-300 hover:bg-gray-700/50"
              onClick={() => setSelectedPartner(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src={selectedPartner.avatar || ""} />
              <AvatarFallback className="bg-gray-600 text-gray-300 font-semibold">
                {selectedPartner.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-200">{selectedPartner.name}</h3>
              {selectedPartner.destination && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedPartner.destination}</span>
                </div>
              )}
            </div>
            
            {/* Theme Selector */}
            <div className="flex items-center gap-3 ml-auto pl-3 border-l border-gray-700/50">
              <span className="text-sm text-gray-400">theme:</span>
              <Select value={chatTheme} onValueChange={(value) => handleThemeChange(value as ChatTheme)}>
                <SelectTrigger className="w-32 h-8 bg-[#1e1e1e] border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="bg-[#252526] border-gray-700">
                  {(Object.keys(THEME_STYLES) as ChatTheme[]).map((theme) => (
                    <SelectItem key={theme} value={theme} className="text-gray-200">
                      {THEME_STYLES[theme].text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Voice Call Button */}
              {!isVoiceCallActive ? (
                <Button
                  onClick={startVoiceCall}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Voice Call
                </Button>
              ) : (
                <div className="flex items-center gap-2 pl-3 border-l border-gray-700/50">
                  <span className="text-xs font-medium text-gray-300">
                    {formatCallDuration(callDuration)}
                  </span>
                  <Button
                    onClick={toggleMicrophone}
                    size="sm"
                    variant={isMicMuted ? "destructive" : "secondary"}
                    className="gap-2"
                  >
                    {isMicMuted ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={toggleScreenShare}
                    size="sm"
                    variant={isScreenSharing ? "default" : "secondary"}
                    className="gap-2"
                  >
                    {isScreenSharing ? (
                      <MonitorOff className="h-4 w-4" />
                    ) : (
                      <Monitor className="h-4 w-4" />
                    )}
                  </Button>
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      size="sm"
                      variant="secondary"
                      className="gap-2"
                    >
                      Record
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                    >
                      Stop Recording
                    </Button>
                  )}
                  <Button
                    onClick={endVoiceCall}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                  >
                    <PhoneOff className="h-4 w-4" />
                    End Call
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Safety Banner */}
          {showSafetyBanner && (
            <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Safety Tip:</span> Never share your financial details or exact home address with people you meet online. Keep conversations within the platform initially.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-amber-600 hover:bg-amber-100 flex-shrink-0"
                onClick={() => setShowSafetyBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Hidden audio elements for voice call */}
          <audio ref={localAudioRef} />
          <audio ref={remoteAudioRef} autoPlay />

          {/* Messages */}
          <div className="flex-1 relative bg-[#1e1e1e]" style={THEME_STYLES[chatTheme].bgImage ? { backgroundImage: `url(${THEME_STYLES[chatTheme].bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <div className="absolute inset-0 bg-black/50" /> {/* Overlay for readability */}
            <ScrollArea className="absolute inset-0 w-full p-4 sm:p-6 z-10">
              <div className="space-y-4 pb-4">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium text-gray-300">
                    No messages yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Start a conversation with {selectedPartner.name}.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId !== selectedPartner.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      {!isOwn && (
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={selectedPartner.avatar || ""} />
                          <AvatarFallback className="text-xs bg-gray-600 text-gray-300">{selectedPartner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-lg ${
                          isOwn
                            ? `${THEME_STYLES[chatTheme].ownBubble}`
                            : `${THEME_STYLES[chatTheme].partnerBubble}`
                        }`}
                      >
                        {msg.imageUrl && (
                          <div className="mb-2">
                            <img
                              src={msg.imageUrl}
                              alt="Shared image"
                              className="max-w-full h-auto rounded-md max-h-64 object-cover"
                            />
                          </div>
                        )}
                        {msg.content && (
                          <p className={`text-sm whitespace-pre-wrap break-words ${
                            isOwn
                              ? THEME_STYLES[chatTheme].ownText
                              : THEME_STYLES[chatTheme].partnerText
                          }`}>
                            {msg.content}
                          </p>
                        )}
                        <p
                          className={`text-[11px] mt-1.5 text-right flex items-center justify-end gap-1 ${
                            isOwn
                              ? "text-blue-300/70"
                              : "text-gray-400"
                          }`}
                        >
                          {formatMessageTime(msg.createdAt)}
                          {isOwn && (
                            msg.read ? (
                              <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-gray-500" />
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          </div>

          {/* Input bar */}
          <form
            onSubmit={handleSendMessage}
            className="flex flex-col p-3 sm:p-4 border-t border-gray-700/50 bg-[#252526]"
          >
            {/* Suggested Texts */}
            {messages.length < 5 && (
              <div className="flex overflow-x-auto scrollbar-hide items-center gap-2 mb-3">
                {SUGGESTED_TEXTS.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setNewMessage(text);
                      inputRef.current?.focus();
                    }}
                    className="whitespace-nowrap text-xs bg-gray-700/50 border border-gray-600/80 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-all font-medium text-gray-300"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#3c3c3c] text-gray-200 border-gray-600/80"
                disabled={sendingMessage}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-md h-10 w-10 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-50"
                disabled={!newMessage.trim() || sendingMessage}
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="hidden md:flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm mt-1">
              Choose a travel buddy to start chatting
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
