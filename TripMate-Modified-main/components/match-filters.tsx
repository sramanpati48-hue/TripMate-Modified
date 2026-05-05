"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

interface Filters {
  gender: string;
  groupPreference: string;
  travelStyle: string;
  destination: string;
}

interface MatchFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function MatchFilters({ filters, onFilterChange }: MatchFiltersProps) {
  const handleFilterUpdate = (key: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filter Matches</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gender Filter */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender Preference</Label>
            <Select
              value={filters.gender}
              onValueChange={(value) => handleFilterUpdate("gender", value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">No preference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group Preference Filter */}
          <div className="space-y-2">
            <Label htmlFor="groupPreference">Travel Type</Label>
            <Select
              value={filters.groupPreference}
              onValueChange={(value) => handleFilterUpdate("groupPreference", value)}
            >
              <SelectTrigger id="groupPreference">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="solo">Solo Travelers</SelectItem>
                <SelectItem value="group">Group Travelers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Travel Style Filter */}
          <div className="space-y-2">
            <Label htmlFor="travelStyle">Travel Style</Label>
            <Select
              value={filters.travelStyle || "all"}
              onValueChange={(value) => handleFilterUpdate("travelStyle", value === "all" ? "" : value)}
            >
              <SelectTrigger id="travelStyle">
                <SelectValue placeholder="All Styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="backpacker">Backpacker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destination Filter */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g. Bali, Paris..."
              value={filters.destination}
              onChange={(e) => handleFilterUpdate("destination", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
