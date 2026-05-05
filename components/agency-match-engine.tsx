"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, SlidersHorizontal } from "lucide-react"
import { AgencyCard } from "@/components/agency-card"
import { mockAgencies, computeMatchScore, type TravelAgency } from "@/lib/agency-data"

interface AgencyMatchEngineProps {
  destination?: string
  budget?: number
  maxResults?: number
  compact?: boolean
}

export function AgencyMatchEngine({ destination, budget, maxResults = 4, compact = false }: AgencyMatchEngineProps) {
  const [searchDest, setSearchDest] = useState(destination || "")
  const [searchBudget, setSearchBudget] = useState(budget?.toString() || "")
  const [showFilters, setShowFilters] = useState(!compact)

  const matchedAgencies: TravelAgency[] = useMemo(() => {
    const dest = searchDest.trim() || undefined
    const bud = searchBudget ? parseInt(searchBudget) : undefined
    return mockAgencies
      .map(a => ({ ...a, matchScore: computeMatchScore(a, dest, bud) }))
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, maxResults)
  }, [searchDest, searchBudget, maxResults])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Agency Match Engine</h3>
            <p className="text-[11px] text-muted-foreground">Powered by TRIPMATE</p>
          </div>
        </div>
        {compact && (
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1.5 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </Button>
        )}
      </div>

      {/* Search Filters */}
      {showFilters && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Destination (e.g., Ladakh)"
              className="pl-8 h-9 text-sm"
              value={searchDest}
              onChange={e => setSearchDest(e.target.value)}
            />
          </div>
          <Input
            placeholder="Budget ₹"
            type="number"
            className="w-28 h-9 text-sm"
            value={searchBudget}
            onChange={e => setSearchBudget(e.target.value)}
          />
        </div>
      )}

      {/* Results */}
      {matchedAgencies.length > 0 ? (
        <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-4"}>
          {matchedAgencies.map(agency => (
            <AgencyCard key={agency.id} agency={agency} showMatchScore />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No agencies matched. Try different filters.</p>
        </div>
      )}

      {/* Badge */}
      <div className="text-center">
        <Badge variant="outline" className="text-[10px] gap-1">
          <Sparkles className="h-2.5 w-2.5" /> Ranked by destination, budget & reviews
        </Badge>
      </div>
    </div>
  )
}
