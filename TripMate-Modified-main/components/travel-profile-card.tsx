"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Heart,
  Users,
  Globe,
  Sparkles,
} from "lucide-react";

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

interface TravelProfileCardProps {
  profile: TravelProfile;
  onConnect: (profile: TravelProfile) => void;
}

export function TravelProfileCard({ profile, onConnect }: TravelProfileCardProps) {
  const getTravelStyleIcon = (style: string) => {
    const icons: { [key: string]: string } = {
      adventure: "🏔️",
      relaxation: "🏖️",
      cultural: "🏛️",
      luxury: "💎",
      budget: "🎒",
      backpacker: "🥾",
    };
    return icons[style] || "✈️";
  };

  const getGroupPreferenceLabel = (pref: string) => {
    const labels: { [key: string]: string } = {
      solo: "Solo Traveler",
      group: "Group Traveler",
      any: "Flexible",
    };
    return labels[pref] || pref;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.user.avatar || ""} />
              <AvatarFallback className="text-xl">
                {profile.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{profile.user.name}</h3>
              {(profile.user.city || profile.user.country) && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {[profile.user.city, profile.user.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {profile.ageRange && (
                <p className="text-xs text-muted-foreground mt-1">
                  Age: {profile.ageRange}
                </p>
              )}
            </div>
          </div>
          {profile.compatibilityScore !== undefined && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {profile.compatibilityScore}% Match
            </Badge>
          )}
        </div>

        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.bio}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Travel Style */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            {getTravelStyleIcon(profile.travelStyle)} Travel Style
          </p>
          <Badge variant="outline" className="capitalize">
            {profile.travelStyle}
          </Badge>
        </div>

        {/* Group Preference */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            <Users className="h-4 w-4" /> Group Preference
          </p>
          <Badge variant="outline">
            {getGroupPreferenceLabel(profile.groupPreference)}
          </Badge>
        </div>

        {/* Destinations */}
        {profile.destinations && profile.destinations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1">
              <Globe className="h-4 w-4" /> Interested in
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.destinations.slice(0, 3).map((dest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {dest}
                </Badge>
              ))}
              {profile.destinations.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.destinations.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Shared Interests */}
        {profile.sharedInterests && profile.sharedInterests.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1">
              <Heart className="h-4 w-4 text-primary" /> Shared Interests
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.sharedInterests.map((interest, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Interests (if no shared interests) */}
        {(!profile.sharedInterests || profile.sharedInterests.length === 0) &&
          profile.interests &&
          profile.interests.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Interests</p>
              <div className="flex flex-wrap gap-1">
                {profile.interests.slice(0, 4).map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {profile.interests.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.interests.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Languages</p>
            <p className="text-sm text-muted-foreground">
              {profile.languages.join(", ")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={() => onConnect(profile)} className="w-full">
          <Heart className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
