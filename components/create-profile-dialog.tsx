"use client";

import { useState, useEffect, useRef } from "react";
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
import { Loader2, Camera, X, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  user?: {
    avatar: string | null;
  };
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const governmentIdInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingGovId, setUploadingGovId] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    customGender: "",
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
    avatar: "",
    governmentId: "",
    idType: "",
    isVerified: false,
  });

  // Input states for array fields
  const [destinationInput, setDestinationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        gender: existingProfile.gender || "",
        customGender: "",
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
        avatar: existingProfile.user?.avatar || "",
        governmentId: "",
        idType: "",
        isVerified: false,
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, WebP, and GIF are allowed",
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploadingAvatar(true);
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        avatar: base64,
      }));
      setUploadingAvatar(false);
      toast({
        title: "Picture selected",
        description: "Your profile picture is ready to save",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  const handleGovIdSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, WebP, and PDF are allowed",
        variant: "destructive",
      });
      if (governmentIdInputRef.current) {
        governmentIdInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (10MB max for documents)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      if (governmentIdInputRef.current) {
        governmentIdInputRef.current.value = "";
      }
      return;
    }

    setUploadingGovId(true);
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        governmentId: base64,
      }));
      setUploadingGovId(false);
      toast({
        title: "Document uploaded",
        description: "Your government ID is ready for verification",
      });
      if (governmentIdInputRef.current) {
        governmentIdInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
      setUploadingGovId(false);
      if (governmentIdInputRef.current) {
        governmentIdInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearGovId = () => {
    setFormData((prev) => ({
      ...prev,
      governmentId: "",
      idType: "",
      isVerified: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit triggered");

    // Validation
    if (!formData.gender || !formData.travelStyle) {
      console.error("Missing required fields: gender or travelStyle");
      toast({
        title: "Missing required fields",
        description: "Please fill in gender and travel style",
        variant: "destructive",
      });
      return;
    }

    if (formData.gender === "other" && !formData.customGender.trim()) {
      console.error("Missing custom gender");
      toast({
        title: "Gender specification required",
        description: "Please specify your gender identity",
        variant: "destructive",
      });
      return;
    }

    if (!formData.governmentId || !formData.idType) {
      console.error("Missing government ID verification");
      toast({
        title: "ID Verification Required",
        description: "Please upload your government ID to create a profile",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log("Submitting profile data:", {
      ...formData,
      avatar: formData.avatar ? `${formData.avatar.substring(0, 50)}...` : null,
    });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        toast({
          title: "Error",
          description: "Authentication token not found. Please login again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/matchmaker/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          // If gender is "other", include the custom gender value in the gender field
          gender: formData.gender === "other" ? formData.customGender : formData.gender,
        }),
      });

      console.log("API response status:", response.status);
      const responseData = await response.json();
      console.log("API response data:", responseData);

      if (response.ok) {
        console.log("Profile created/updated successfully");
        toast({
          title: existingProfile ? "Profile updated! ✨" : "Profile created! ✨",
          description: existingProfile
            ? "Your travel profile has been updated"
            : "Your travel profile has been created successfully",
        });
        // Close dialog and trigger refresh
        onSuccess();
      } else {
        console.error("API error response:", responseData);
        const errorMessage = responseData.details || responseData.error || "Unknown error occurred";
        toast({
          title: "Failed to save profile",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save travel profile",
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
          {/* Avatar Upload */}
          <div className="space-y-3">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={formData.avatar || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-semibold">
                  {formData.gender?.charAt(0).toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 flex-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {formData.avatar ? "Change Picture" : "Upload Picture"}
                </Button>
                {formData.avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAvatar}
                    className="w-full text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploadingAvatar}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, WebP, GIF (Max 5MB)
            </p>
          </div>

          {/* Government ID Verification */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>
                Identity Verification <span className="text-destructive">*</span>
              </Label>
              {formData.isVerified && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Verified</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a copy of your government-issued ID to verify your identity. This is required to create your profile and helps ensure community safety. Your identity is kept confidential and is only used for verification.
            </p>
            
            <div className="space-y-3">
              {/* ID Type Selection */}
              <div>
                <Label htmlFor="idType" className="text-sm">ID Type</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => setFormData({ ...formData, idType: value })}
                >
                  <SelectTrigger id="idType" className="mt-1.5">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                    <SelectItem value="national-id">National ID Card</SelectItem>
                    <SelectItem value="visa">Visa/Travel Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ID Document Upload */}
              <div>
                <Label className="text-sm">Upload Document</Label>
                <div className="mt-2 flex flex-col gap-2">
                  {formData.governmentId ? (
                    <div className="border border-dashed border-green-500 bg-green-50 dark:bg-green-950/20 rounded-lg p-4 flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">Document uploaded</p>
                        <p className="text-xs text-green-600 dark:text-green-400/70 mt-1">
                          {formData.idType && `Type: ${formData.idType}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Pending verification by our team (usually within 24 hours)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearGovId}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => governmentIdInputRef.current?.click()}
                      disabled={uploadingGovId}
                      className="w-full border-dashed"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {uploadingGovId ? "Uploading..." : "Click to upload or drag & drop"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <input
              ref={governmentIdInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.pdf"
              onChange={handleGovIdSelect}
              className="hidden"
              disabled={uploadingGovId}
            />

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-3 flex gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Your government ID is encrypted and stored securely. We never share your personal information with other users.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value, customGender: "" })}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Custom Gender Input */}
            {formData.gender === "other" && (
              <Input
                placeholder="Please specify your gender identity"
                value={formData.customGender}
                onChange={(e) => setFormData({ ...formData, customGender: e.target.value })}
                className="mt-2"
              />
            )}
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
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="backpacker">Backpacker</SelectItem>
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

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.governmentId || !formData.idType || (formData.gender === "other" && !formData.customGender.trim())} 
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existingProfile ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
