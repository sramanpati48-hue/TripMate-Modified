"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Heart, MessageSquare, Settings, Loader2, UserPlus } from "lucide-react";
import { TravelProfileCard } from "@/components/travel-profile-card";
import { MatchFilters } from "@/components/match-filters";
import { TravelRequestDialog } from "@/components/travel-request-dialog";
import { CreateProfileDialog } from "@/components/create-profile-dialog";

interface TravelProfile {
  id: string;
  userId: string;
  gender: string;
  preferredGender: string;
  travelStyle: string;
  groupPreference: string;
  groupSize: string | null;
  interests: string[];
  destinations: string[];
  languages: string[];
  availability: any;
  bio: string | null;
  ageRange: string | null;
  isActive: boolean;
  compatibilityScore?: number;
  sharedInterests?: string[];
  user: {
    id: string;
    name: string;
    avatar: string | null;
    city: string | null;
    country: string | null;
  };
}

interface TravelRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message: string | null;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar: string | null;
    email: string;
  };
  receiver?: {
    id: string;
    name: string;
    avatar: string | null;
    email: string;
  };
}

export default function MatchmakerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<TravelProfile | null>(null);
  const [matches, setMatches] = useState<TravelProfile[]>([]);
  const [sentRequests, setSentRequests] = useState<TravelRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<TravelRequest[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<TravelProfile | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [filters, setFilters] = useState({
    gender: "any",
    groupPreference: "any",
    travelStyle: "",
    destination: "",
  });

  useEffect(() => {
    checkAuth();
    fetchUserProfile();
    fetchRequests();
  }, []);

  useEffect(() => {
    if (hasProfile) {
      fetchMatches();
    }
  }, [hasProfile, filters]);

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/matchmaker/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setHasProfile(true);
      } else if (response.status === 404) {
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const params = new URLSearchParams();
      
      if (filters.gender && filters.gender !== "any") {
        params.append("gender", filters.gender);
      }
      if (filters.groupPreference && filters.groupPreference !== "any") {
        params.append("groupPreference", filters.groupPreference);
      }
      if (filters.travelStyle) {
        params.append("travelStyle", filters.travelStyle);
      }
      if (filters.destination) {
        params.append("destination", filters.destination);
      }

      const response = await fetch(`/api/matchmaker/matches?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/matchmaker/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSentRequests(data.sentRequests);
        setReceivedRequests(data.receivedRequests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleConnect = (match: TravelProfile) => {
    setSelectedMatch(match);
    setShowRequestDialog(true);
  };

  const handleRequestSent = () => {
    fetchRequests();
    fetchMatches();
  };

  const handleProfileCreated = () => {
    fetchUserProfile();
    setShowProfileDialog(false);
  };

  const handleRequestUpdate = async (requestId: string, status: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/matchmaker/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, status }),
      });

      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl">Welcome to Travel Matchmaker!</CardTitle>
            <CardDescription className="text-lg mt-4">
              Find travel companions who share your interests and travel style. 
              Create your travel profile to get started!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-6 rounded-lg space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Features:
              </h3>
              <ul className="space-y-2 ml-7">
                <li>✓ Match with travelers based on preferences</li>
                <li>✓ Filter by gender, travel style, and destinations</li>
                <li>✓ Send and receive travel requests</li>
                <li>✓ Build your travel network</li>
              </ul>
            </div>
            <Button
              onClick={() => setShowProfileDialog(true)}
              className="w-full"
              size="lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Travel Profile
            </Button>
          </CardContent>
        </Card>

        {showProfileDialog && (
          <CreateProfileDialog
            onClose={() => setShowProfileDialog(false)}
            onSuccess={handleProfileCreated}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Find Travel Buddies</h1>
          <p className="text-muted-foreground mt-2">
            Connect with travelers who share your passion for exploration
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowProfileDialog(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches">
            <Users className="mr-2 h-4 w-4" />
            Matches ({matches.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            <MessageSquare className="mr-2 h-4 w-4" />
            Sent ({sentRequests.length})
          </TabsTrigger>
          <TabsTrigger value="received">
            <Heart className="mr-2 h-4 w-4" />
            Received ({receivedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-6">
          <MatchFilters filters={filters} onFilterChange={setFilters} />
          
          {matches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later for new travelers
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <TravelProfileCard
                  key={match.id}
                  profile={match}
                  onConnect={handleConnect}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No sent requests</h3>
                <p className="text-muted-foreground">
                  Start connecting with travelers from the Matches tab
                </p>
              </CardContent>
            </Card>
          ) : (
            sentRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.receiver?.avatar || ""} />
                        <AvatarFallback>
                          {request.receiver?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{request.receiver?.name}</CardTitle>
                        <CardDescription>
                          {request.destination || "No specific destination"}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        request.status === "accepted"
                          ? "default"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                {request.message && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{request.message}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No received requests</h3>
                <p className="text-muted-foreground">
                  When someone sends you a travel request, it will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            receivedRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.sender?.avatar || ""} />
                        <AvatarFallback>
                          {request.sender?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{request.sender?.name}</CardTitle>
                        <CardDescription>
                          {request.destination || "No specific destination"}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        request.status === "accepted"
                          ? "default"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.message && (
                    <p className="text-sm text-muted-foreground">{request.message}</p>
                  )}
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRequestUpdate(request.id, "accepted")}
                        className="flex-1"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRequestUpdate(request.id, "rejected")}
                        variant="outline"
                        className="flex-1"
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {showRequestDialog && selectedMatch && (
        <TravelRequestDialog
          match={selectedMatch}
          onClose={() => {
            setShowRequestDialog(false);
            setSelectedMatch(null);
          }}
          onSuccess={handleRequestSent}
        />
      )}

      {showProfileDialog && (
        <CreateProfileDialog
          existingProfile={userProfile}
          onClose={() => setShowProfileDialog(false)}
          onSuccess={handleProfileCreated}
        />
      )}
    </div>
  );
}
