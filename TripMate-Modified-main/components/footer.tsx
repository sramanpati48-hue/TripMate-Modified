"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { useI18n } from "@/components/language-provider"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TRIPMATE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.explore")}</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/explore" className="hover:text-primary transition-colors">
                {t("footer.destinations")}
              </Link>
              <Link href="/explore?category=food" className="hover:text-primary transition-colors">
                {t("footer.foodDining")}
              </Link>
              <Link href="/explore?category=events" className="hover:text-primary transition-colors">
                {t("footer.events")}
              </Link>
              <Link href="/explore?category=hotels" className="hover:text-primary transition-colors">
                {t("footer.hotels")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.plan")}</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/trip-planner" className="hover:text-primary transition-colors">
                {t("navbar.tripPlanner")}
              </Link>
              <Link href="/map" className="hover:text-primary transition-colors">
                {t("footer.mapView")}
              </Link>
              <Link href="/trip-planner#ai" className="hover:text-primary transition-colors">
                {t("footer.aiItinerary")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.company")}</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-primary transition-colors">
                {t("footer.about")}
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                {t("footer.contact")}
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                {t("footer.privacyPolicy")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TRIPMATE. {t("footer.rightsReserved")}</p>
        </div>
      </div>
    </footer>
  )
}
