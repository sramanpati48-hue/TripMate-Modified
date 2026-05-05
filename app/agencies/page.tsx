"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AgencyCard } from "@/components/agency-card"
import { AgencyAdBanner } from "@/components/agency-ad-banner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, Building2, ShieldCheck, Star, Sparkles } from "lucide-react"
import { mockAgencies, getEliteAgencies } from "@/lib/agency-data"
import type { Category } from "@/lib/mock-data"

type FilterType = "all" | "verified" | "featured" | "elite" | "premium"

export default function AgenciesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [selectedSpec, setSelectedSpec] = useState<Category | "All">("All")

  const specs: (Category | "All")[] = ["All", "Adventure", "Nature", "Heritage", "Beach", "Spiritual", "Hill Station", "Wildlife"]

  const filteredAgencies = useMemo(() => {
    return mockAgencies.filter(agency => {
      const matchesSearch = !searchQuery ||
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.destinations.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
        agency.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesFilter =
        activeFilter === "all" ? true :
        activeFilter === "verified" ? agency.verified :
        activeFilter === "featured" ? agency.featured :
        activeFilter === "elite" ? agency.adTier === "elite" :
        activeFilter === "premium" ? agency.adTier === "premium" || agency.adTier === "elite" :
        true

      const matchesSpec = selectedSpec === "All" || agency.specializations.includes(selectedSpec)

      return matchesSearch && matchesFilter && matchesSpec
    })
  }, [searchQuery, activeFilter, selectedSpec])

  const eliteAgency = getEliteAgencies()[1] || getEliteAgencies()[0]

  const filterButtons: { key: FilterType; label: string; icon?: React.ElementType }[] = [
    { key: "all", label: "All Agencies" },
    { key: "verified", label: "Verified", icon: ShieldCheck },
    { key: "featured", label: "Featured", icon: Star },
    { key: "elite", label: "Elite Partners", icon: Sparkles },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#0f1a2e] to-[#1a0f2e] py-16 md:py-20">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(249,115,22,0.2), transparent 50%), radial-gradient(circle at 70% 60%, rgba(139,92,246,0.2), transparent 50%)" }}
          />
          <div className="container relative mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-5 py-2 text-sm font-medium text-orange-300 mb-5 animate-fade-rise">
              <Building2 className="h-4 w-4" />
              Agency Directory
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-rise-delay">
              Find Your Perfect <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Travel Agency</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto mb-8 animate-fade-rise-delay-2">
              Browse verified travel agencies across India. Get matched based on your destination, budget, and travel style.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto relative animate-fade-rise-delay-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                placeholder="Search agencies, destinations, or specializations..."
                className="pl-12 h-12 text-base bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:bg-white/15 rounded-xl"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filter row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {filterButtons.map(f => (
                <Button
                  key={f.key}
                  variant={activeFilter === f.key ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.icon && <f.icon className="h-3.5 w-3.5" />}
                  {f.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>{filteredAgencies.length} agencies</span>
            </div>
          </div>

          {/* Specialization chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {specs.map(spec => (
              <Badge
                key={spec}
                variant={selectedSpec === spec ? "default" : "outline"}
                className="cursor-pointer text-xs px-3 py-1 transition-colors hover:bg-primary/20"
                onClick={() => setSelectedSpec(spec)}
              >
                {spec}
              </Badge>
            ))}
          </div>

          {/* Sponsored banner */}
          {eliteAgency && <AgencyAdBanner agency={eliteAgency} />}

          {/* Agency Grid */}
          {filteredAgencies.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {filteredAgencies.map(agency => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-lg font-semibold mb-2">No agencies found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearchQuery(""); setActiveFilter("all"); setSelectedSpec("All") }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
