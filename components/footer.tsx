"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { useI18n } from "@/components/language-provider"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="relative border-t border-white/10 bg-[#071019]/95 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.10),_transparent_35%)]" />
      <div className="container relative mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-orange-300" />
              <span className="text-xl font-bold">TRIPMATE</span>
            </Link>
            <p className="text-sm text-white/65">
              {t("footer.description")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.explore")}</h4>
            <nav className="flex flex-col gap-2 text-sm text-white/65">
              <Link href="/explore" className="transition-colors hover:text-orange-300">
                {t("footer.destinations")}
              </Link>
              <Link href="/explore?category=food" className="transition-colors hover:text-orange-300">
                {t("footer.foodDining")}
              </Link>
              <Link href="/explore?category=events" className="transition-colors hover:text-orange-300">
                {t("footer.events")}
              </Link>
              <Link href="/explore?category=hotels" className="transition-colors hover:text-orange-300">
                {t("footer.hotels")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.plan")}</h4>
            <nav className="flex flex-col gap-2 text-sm text-white/65">
              <Link href="/trip-planner" className="transition-colors hover:text-orange-300">
                {t("navbar.tripPlanner")}
              </Link>
              <Link href="/map" className="transition-colors hover:text-orange-300">
                {t("footer.mapView")}
              </Link>
              <Link href="/trip-planner#ai" className="transition-colors hover:text-orange-300">
                {t("footer.aiItinerary")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.company")}</h4>
            <nav className="flex flex-col gap-2 text-sm text-white/65">
              <Link href="/about" className="transition-colors hover:text-orange-300">
                {t("footer.about")}
              </Link>
              <Link href="/contact" className="transition-colors hover:text-orange-300">
                {t("footer.contact")}
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-orange-300">
                {t("footer.privacyPolicy")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/55">
          <p>&copy; {new Date().getFullYear()} TRIPMATE. {t("footer.rightsReserved")}</p>
        </div>
      </div>
    </footer>
  )
}
