"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import TransportFeatureSelector from "@/components/transport-feature-selector"

export type TransportSearchParams = {
  from: string
  to: string
  date: string
  returnDate?: string
  passengers: number
  tripType: "one-way" | "round-trip"
}

export default function TransportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="relative flex-1 overflow-hidden bg-transparent text-slate-900">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-center opacity-100 saturate-125 brightness-110"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,246,235,0.10)_45%,rgba(255,250,243,0.18)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[50vh] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[44vh] bg-[linear-gradient(180deg,rgba(255,248,240,0.00)_0%,rgba(255,248,240,0.06)_100%)]" />
          <div className="absolute inset-x-0 top-[50vh] h-[50vh] origin-top scale-y-[-1] opacity-28 blur-[1px]">
            <video
              className="absolute inset-0 h-full w-full object-cover object-center"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
              muted
              playsInline
              autoPlay
              loop
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,240,0.12)_0%,rgba(255,248,240,0.82)_100%)]" />
          </div>
        </div>

        <TransportFeatureSelector />
      </main>
      <Footer />
    </div>
  )
}
