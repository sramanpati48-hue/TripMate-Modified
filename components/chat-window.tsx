"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  MessageSquare,
  ArrowLeft,
  Loader2,
  MapPin,
  ShieldAlert,
  X,
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

type ChatTheme = 'default' | 'ocean' | 'sunset' | 'forest' | 'humane' | 'vscode';

const THEME_STYLES: Record<ChatTheme, { button: string, text: string, ownBubble: string, partnerBubble: string, ownText: string, partnerText: string, bgImage: string }> = {
  default: { button: 'bg-primary text-primary-foreground', text: 'Default', ownBubble: 'bg-primary text-primary-foreground', partnerBubble: 'bg-muted shadow-sm hover:shadow transition-shadow backdrop-blur-sm', ownText: 'text-primary-foreground', partnerText: 'text-foreground', bgImage: '/themes/default.png' },
  ocean: { button: 'bg-blue-600', text: 'Ocean', ownBubble: 'bg-blue-600 text-white shadow-md', partnerBubble: 'bg-white text-blue-900 border border-blue-200 shadow-sm', ownText: 'text-white', partnerText: 'text-blue-900', bgImage: '/themes/ocean.png' },
  sunset: { button: 'bg-rose-500', text: 'Sunset', ownBubble: 'bg-rose-500 text-white shadow-md', partnerBubble: 'bg-white text-rose-900 border border-rose-200 shadow-sm', ownText: 'text-white', partnerText: 'text-rose-900', bgImage: '/themes/sunset.png' },
  forest: { button: 'bg-emerald-600', text: 'Forest', ownBubble: 'bg-emerald-600 text-white shadow-md', partnerBubble: 'bg-emerald-50/90 text-emerald-900 border border-emerald-200 shadow-sm backdrop-blur-sm', ownText: 'text-white', partnerText: 'text-emerald-900', bgImage: '/themes/forest.png' },
  humane: { button: 'bg-amber-700', text: 'Humane', ownBubble: 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md', partnerBubble: 'bg-stone-100/90 text-stone-800 border border-stone-200 shadow-sm backdrop-blur-sm dark:bg-stone-800/90 dark:text-stone-200 dark:border-stone-700', ownText: 'text-white', partnerText: 'text-stone-800 dark:text-stone-200', bgImage: '/themes/humane.png' },
  vscode: { button: 'bg-blue-500', text: 'VS Code', ownBubble: 'bg-blue-500/20 text-blue-100 border border-blue-500/30', partnerBubble: 'bg-gray-700/30 border border-gray-600/50 text-gray-50', ownText: 'text-blue-100', partnerText: 'text-gray-50', bgImage: '/themes/vscode.png' }
};

export function ChatWindow({ initialPartnerId }: ChatWindowProps) {
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const [chatTheme, setChatTheme] = useState<ChatTheme>('default');
  const [bgImage, setBgImage] = useState<string>("");

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
    if ((!newMessage.trim() && !newImageUrl.trim()) || !selectedPartner || sendingMessage) return;

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
          imageUrl: newImageUrl.trim() || null,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        setNewImageUrl("");
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
        <CardHeader className="py-3 px-4 border-b border-gray-700/50 shrink-0">
          <CardTitle className="text-lg font-semibold text-gray-200">Conversations</CardTitle>
        </CardHeader>
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
                    <p className={`text-xs truncate mt-0.5 ${partner.unreadCount > 0 ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                      {partner.lastMessage}
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
            <div className="flex items-center gap-2 ml-auto pl-3 border-l border-gray-700/50">
              <div className="flex gap-2 items-center">
                {(Object.keys(THEME_STYLES) as ChatTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    title={`Switch to ${THEME_STYLES[theme].text} theme`}
                    className={`h-5 w-5 rounded-full shadow-inner transition-all duration-200 ease-in-out transform ${THEME_STYLES[theme].button} ${
                      chatTheme === theme 
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#252526] scale-110' 
                        : 'opacity-80 hover:opacity-100 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
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

          {/* Messages */}
          <div className="flex-1 relative bg-[#1e1e1e]" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}}>
            <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
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
                          className={`text-[11px] mt-1.5 text-right ${
                            isOwn
                              ? "text-blue-300/70"
                              : "text-gray-400"
                          }`}
                        >
                          {formatMessageTime(msg.createdAt)}
                          {isOwn && (
                            <span className={`ml-1.5 transition-colors ${msg.read ? 'text-blue-400' : 'text-gray-500'}`}>{msg.read ? "✓✓" : "✓"}</span>
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
              <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-md border border-gray-600/80 bg-[#3c3c3c] text-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={sendingMessage}
            />
              <Button
                type="submit"
                size="icon"
                className="rounded-md h-10 w-10 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-50"
                disabled={(!newMessage.trim() && !newImageUrl.trim()) || sendingMessage}
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Image URL Input */}
            <div className="mt-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (optional)..."
                className="w-full rounded-md border border-gray-600/80 bg-[#3c3c3c] text-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={sendingMessage}
              />
              {newImageUrl && (
                <div className="mt-2 relative w-full max-w-xs">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full h-auto rounded-md max-h-40 object-cover"
                    onError={() => setNewImageUrl("")}
                  />
                  <button
                    type="button"
                    onClick={() => setNewImageUrl("")}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
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
