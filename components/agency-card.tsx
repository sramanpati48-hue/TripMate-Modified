"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, ShieldCheck, TrendingUp, ArrowRight, IndianRupee } from "lucide-react"
import type { TravelAgency } from "@/lib/agency-data"

interface AgencyCardProps {
  agency: TravelAgency
  showMatchScore?: boolean
}

export function AgencyCard({ agency, showMatchScore }: AgencyCardProps) {
  const tierColor = {
    elite: "from-amber-500 to-orange-600",
    premium: "from-violet-500 to-purple-600",
    basic: "from-slate-400 to-slate-500",
  }

  const tierLabel = {
    elite: "Elite Partner",
    premium: "Premium",
    basic: "Verified",
  }

  return (
    <Card className="relative overflow-hidden agency-card-hover border-border/50 group">
      {/* Featured ribbon */}
      {agency.featured && (
        <div className="featured-ribbon z-10">★ FEATURED</div>
      )}

      {/* Cover image */}
      <div className="relative h-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${agency.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Tier badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`bg-gradient-to-r ${tierColor[agency.adTier]} text-white text-[10px] border-0 shadow-lg`}>
            {tierLabel[agency.adTier]}
          </Badge>
        </div>
        {/* Agency logo */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-lg font-bold text-orange-600 border border-white/50">
            {agency.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-white font-semibold text-sm drop-shadow-lg">{agency.name}</h3>
              {agency.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 drop-shadow" />
              )}
            </div>
            <p className="text-white/80 text-[11px] drop-shadow">{agency.tagline}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Rating + Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span className="text-sm font-semibold">{agency.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({agency.reviewCount.toLocaleString()} reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{agency.location}</span>
          </div>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5">
          {agency.specializations.map(spec => (
            <Badge key={spec} variant="outline" className="text-[10px] px-2 py-0.5">
              {spec}
            </Badge>
          ))}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-2 text-sm">
          <IndianRupee className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">
            ₹{agency.priceRange.min.toLocaleString()} – ₹{agency.priceRange.max.toLocaleString()}
          </span>
        </div>

        {/* Match Score */}
        {showMatchScore && agency.matchScore !== undefined && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" /> Match Score
              </span>
              <span className="font-semibold text-emerald-600">{agency.matchScore}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${agency.matchScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {agency.totalBookings.toLocaleString()} bookings
          </span>
          <Link href={`/agencies/${agency.id}`}>
            <Button size="sm" className="gap-1.5 text-xs h-8 bg-primary hover:bg-primary/90">
              View Profile <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
