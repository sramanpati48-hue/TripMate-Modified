"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, X } from "lucide-react"
import type { Region, Category } from "@/lib/mock-data"

interface FiltersProps {
  selectedRegion?: Region | "All"
  selectedCategory?: Category | "All"
  onRegionChange?: (region: Region | "All") => void
  onCategoryChange?: (category: Category | "All") => void
}

const regions: (Region | "All")[] = ["All", "North", "South", "East", "West", "Central", "Northeast"]
const categories: (Category | "All")[] = ["All", "Spiritual", "Adventure", "Heritage", "Nature", "Beach", "Hill Station", "Wildlife"]

export function Filters({ selectedRegion = "All", selectedCategory = "All", onRegionChange, onCategoryChange }: FiltersProps) {
  const hasActiveFilters = selectedRegion !== "All" || selectedCategory !== "All"
  const clearFilters = () => { onRegionChange?.("All"); onCategoryChange?.("All") }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="hidden md:flex items-center gap-3">
        <Select value={selectedRegion} onValueChange={(v) => onRegionChange?.(v as Region | "All")}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>{regions.map((region) => (<SelectItem key={region} value={region}>{region} {region !== "All" && "India"}</SelectItem>))}</SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={(v) => onCategoryChange?.(v as Category | "All")}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
        </Select>
        {hasActiveFilters && (<Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2"><X className="h-4 w-4" />Clear</Button>)}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden gap-2"><SlidersHorizontal className="h-4 w-4" />Filters</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
          <div className="space-y-6 mt-6">
            <div><label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={selectedRegion} onValueChange={(v) => onRegionChange?.(v as Region | "All")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{regions.map((region) => (<SelectItem key={region} value={region}>{region} {region !== "All" && "India"}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={(v) => onCategoryChange?.(v as Category | "All")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (<Button onClick={clearFilters} className="w-full">Clear All Filters</Button>)}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
