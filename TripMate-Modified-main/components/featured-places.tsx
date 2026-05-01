"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlaceCard } from "@/components/place-card"
import { PlaceDetailsDialog } from "@/components/place-details-dialog"
import { getFeaturedPlaces } from "@/lib/mock-data"
import type { Place } from "@/lib/mock-data"
import { ArrowRight } from "lucide-react"
import { useI18n } from "@/components/language-provider"

export function FeaturedPlaces() {
  const featuredPlaces = getFeaturedPlaces()
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const { t } = useI18n()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("featured.heading")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t("featured.subtitle")}
            </p>
          </div>
          <Link href="/explore" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              {t("featured.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSelect={setSelectedPlace}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/explore">
            <Button variant="outline" className="gap-2">
              {t("featured.viewAllDestinations")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {selectedPlace && (
        <PlaceDetailsDialog
          place={selectedPlace}
          open={!!selectedPlace}
          onOpenChange={(open) => !open && setSelectedPlace(null)}
        />
      )}
    </section>
  )
}
