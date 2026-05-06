"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Megaphone } from "lucide-react"
import { getEliteAgencies, type TravelAgency } from "@/lib/agency-data"

interface AgencyAdBannerProps {
  agency?: TravelAgency
  variant?: "inline" | "sidebar" | "hero"
}

export function AgencyAdBanner({ agency, variant = "inline" }: AgencyAdBannerProps) {
  const featured = agency || getEliteAgencies()[0]
  if (!featured) return null

  if (variant === "sidebar") {
    return (
      <div className="rounded-xl overflow-hidden border border-border/50 glass-card">
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featured.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-white font-semibold text-sm">{featured.name}</p>
            <p className="text-white/70 text-[11px]">{featured.tagline}</p>
          </div>
        </div>
        <div className="p-3 space-y-2">
          <span className="sponsored-label">Sponsored</span>
          <p className="text-xs text-muted-foreground line-clamp-2">{featured.description}</p>
          <Link href={`/agencies/${featured.id}`}>
            <Button size="sm" className="w-full text-xs h-8 gap-1.5 mt-1">
              Learn More <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden my-8 agency-card-hover">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${featured.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
        <div className="flex items-center gap-4 text-white">
          <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm items-center justify-center border border-white/20">
            <Megaphone className="h-7 w-7 text-orange-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-orange-500/80 text-white border-0 text-[10px]">
                ★ SPONSORED
              </Badge>
            </div>
            <h3 className="text-lg md:text-xl font-bold">{featured.name}</h3>
            <p className="text-white/75 text-sm mt-0.5 max-w-md">{featured.tagline} — {featured.destinations.slice(0, 3).join(", ")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-white/70 text-xs">Starting from</div>
            <div className="text-white text-lg font-bold">₹{featured.priceRange.min.toLocaleString()}</div>
          </div>
          <Link href={`/agencies/${featured.id}`}>
            <Button className="bg-white text-black hover:bg-white/90 gap-2 shadow-xl font-semibold">
              Book Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
