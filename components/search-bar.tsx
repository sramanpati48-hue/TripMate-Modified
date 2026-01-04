"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchDestinations, type IndianDestination } from "@/lib/indian-destinations"

interface SearchSuggestion {
  id: string
  name: string
  type: "destination" | "food" | "event" | "hotel"
  location?: string
}

const trendingSearches = ["Goa", "Manali", "Jaipur", "Kerala", "Ladakh", "Udaipur"]

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  placeholder?: string
  showSuggestions?: boolean
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  className,
  placeholder = "Search destinations in India...",
  showSuggestions = true,
}: SearchBarProps) {
  const [query, setQuery] = useState(value || "")
  const [isOpen, setIsOpen] = useState(false)
  const [destinations, setDestinations] = useState<IndianDestination[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true)
      // Fetch from API with debouncing
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search-destinations?q=${encodeURIComponent(query)}&limit=10`)
          if (response.ok) {
            const results = await response.json()
            setDestinations(results)
          } else {
            // Fallback to local search
            const localResults = searchDestinations(query, 8)
            setDestinations(localResults)
          }
        } catch (error) {
          console.error('Search error:', error)
          // Fallback to local search
          const localResults = searchDestinations(query, 8)
          setDestinations(localResults)
        } finally {
          setIsSearching(false)
        }
      }, 300) // Debounce for 300ms

      return () => clearTimeout(timer)
    } else {
      setDestinations([])
      setIsSearching(false)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange?.(newValue)
  }

  const handleSelect = (value: string) => {
    setQuery(value)
    onChange?.(value)
    onSearch?.(value)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(query)
      setIsOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => showSuggestions && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-12 pl-12 pr-4 text-base bg-background"
        />
      </div>

      {showSuggestions && isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border bg-popover shadow-lg max-h-[400px] overflow-auto">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-3"></div>
              <p className="text-muted-foreground">Searching destinations...</p>
            </div>
          ) : query.length > 0 && destinations.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {destinations.length} {destinations.length === 1 ? 'Destination' : 'Destinations'} Found
              </p>
              {destinations.map((dest, index) => (
                <button
                  key={`${dest.name}-${index}`}
                  onClick={() => handleSelect(dest.name)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-accent transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{dest.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {dest.state} • {dest.type.join(', ')}
                    </p>
                    {dest.popularFor && (
                      <p className="text-xs text-muted-foreground/70 truncate">
                        Popular for: {dest.popularFor}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-8 text-center">
              <Search className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No destinations found for "{query}"</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Try searching for cities, states, or types</p>
            </div>
          ) : (
            <div className="p-2">
              <div>
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" /> Trending Destinations
                </p>
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSelect(search)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-accent transition-colors"
                  >
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
