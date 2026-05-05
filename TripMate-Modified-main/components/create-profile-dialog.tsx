"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TravelProfile {
  gender: string;
  preferredGender: string;
  travelStyle: string;
  groupPreference: string;
  groupSize: string | null;
  interests: string[];
  destinations: string[];
  languages: string[];
  bio: string | null;
  ageRange: string | null;
  isActive: boolean;
}

interface CreateProfileDialogProps {
  existingProfile?: TravelProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

const interestOptions = [
  "Hiking",
  "Photography",
  "Food & Cuisine",
  "Nightlife",
  "Beach",
  "Museums",
  "Shopping",
  "Wildlife",
  "History",
  "Adventure Sports",
  "Yoga & Wellness",
  "Local Culture",
];

export function CreateProfileDialog({
  existingProfile,
  onClose,
  onSuccess,
}: CreateProfileDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    preferredGender: "any",
    travelStyle: "",
    groupPreference: "any",
    groupSize: "",
    bio: "",
    ageRange: "",
    interests: [] as string[],
    destinations: [] as string[],
    languages: [] as string[],
    isActive: true,
  });

  // Input states for array fields
  const [destinationInput, setDestinationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        gender: existingProfile.gender || "",
        preferredGender: existingProfile.preferredGender || "any",
        travelStyle: existingProfile.travelStyle || "",
        groupPreference: existingProfile.groupPreference || "any",
        groupSize: existingProfile.groupSize || "",
        bio: existingProfile.bio || "",
        ageRange: existingProfile.ageRange || "",
        interests: existingProfile.interests || [],
        destinations: existingProfile.destinations || [],
        languages: existingProfile.languages || [],
        isActive: existingProfile.isActive !== undefined ? existingProfile.isActive : true,
      });
    }
  }, [existingProfile]);

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleAddDestination = () => {
    if (destinationInput.trim() && !formData.destinations.includes(destinationInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        destinations: [...prev.destinations, destinationInput.trim()],
      }));
      setDestinationInput("");
    }
  };

  const handleRemoveDestination = (dest: string) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((d) => d !== dest),
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }));
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.gender || !formData.travelStyle) {
      toast({
        title: "Missing required fields",
        description: "Please fill in gender and travel style",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/matchmaker/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: existingProfile ? "Profile updated! ✨" : "Profile created! ✨",
          description: existingProfile
            ? "Your travel profile has been updated"
            : "Your travel profile has been created successfully",
        });
        onSuccess();
      } else {
        const error = await response.json();
        toast({
          title: "Failed to save profile",
          description: error.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save travel profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingProfile ? "Edit Travel Profile" : "Create Travel Profile"}
          </DialogTitle>
          <DialogDescription>
            {existingProfile
              ? "Update your preferences to find better matches"
              : "Tell us about your travel preferences to find compatible companions"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender Preference */}
          <div className="space-y-2">
            <Label htmlFor="preferredGender">Who would you like to travel with?</Label>
            <Select
              value={formData.preferredGender}
              onValueChange={(value) =>
                setFormData({ ...formData, preferredGender: value })
              }
            >
              <SelectTrigger id="preferredGender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Anyone</SelectItem>
                <SelectItem value="same-as-me">Same gender as me</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Travel Style */}
          <div className="space-y-2">
            <Label htmlFor="travelStyle">
              Travel Style <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.travelStyle}
              onValueChange={(value) =>
                setFormData({ ...formData, travelStyle: value })
              }
            >
              <SelectTrigger id="travelStyle">
                <SelectValue placeholder="Select your travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">🏔️ Adventure</SelectItem>
                <SelectItem value="relaxation">🏖️ Relaxation</SelectItem>
                <SelectItem value="cultural">🏛️ Cultural</SelectItem>
                <SelectItem value="luxury">💎 Luxury</SelectItem>
                <SelectItem value="budget">🎒 Budget</SelectItem>
                <SelectItem value="backpacker">🥾 Backpacker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group Preference */}
          <div className="space-y-2">
            <Label htmlFor="groupPreference">Solo or Group Travel?</Label>
            <Select
              value={formData.groupPreference}
              onValueChange={(value) =>
                setFormData({ ...formData, groupPreference: value })
              }
            >
              <SelectTrigger id="groupPreference">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Flexible</SelectItem>
                <SelectItem value="solo">Prefer Solo</SelectItem>
                <SelectItem value="group">Prefer Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <Label htmlFor="ageRange">Age Range</Label>
            <Select
              value={formData.ageRange}
              onValueChange={(value) => setFormData({ ...formData, ageRange: value })}
            >
              <SelectTrigger id="ageRange">
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46+">46+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Travel Interests</Label>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <label
                    htmlFor={interest}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-2">
            <Label htmlFor="destination-input">Interested Destinations</Label>
            <div className="flex gap-2">
              <Input
                id="destination-input"
                placeholder="Add a destination..."
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddDestination())}
              />
              <Button type="button" onClick={handleAddDestination} variant="secondary">
                Add
              </Button>
            </div>
            {formData.destinations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.destinations.map((dest) => (
                  <span
                    key={dest}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-secondary"
                  >
                    {dest}
                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(dest)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label htmlFor="language-input">Languages Spoken</Label>
            <div className="flex gap-2">
              <Input
                id="language-input"
                placeholder="Add a language..."
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
              />
              <Button type="button" onClick={handleAddLanguage} variant="secondary">
                Add
              </Button>
            </div>
            {formData.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-secondary"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(lang)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              placeholder="Tell travelers about yourself and what you're looking for in a travel companion..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingProfile ? "Update Profile" : "Create Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
