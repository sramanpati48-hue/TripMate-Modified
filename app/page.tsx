"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AgencyCard } from '@/components/agency-card'
import { AgencyAdBanner } from '@/components/agency-ad-banner'
import { RevenueShowcase } from '@/components/revenue-showcase'
import { getFeaturedAgencies, getEliteAgencies } from '@/lib/agency-data'
import { Building2, ArrowRight, Search, Compass, Users, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoOpacity, setVideoOpacity] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const featuredAgencies = getFeaturedAgencies()
  const eliteAgency = getEliteAgencies()[0]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let frameId: number
    let timeoutId: number | undefined

    const monitorVideoLoop = () => {
      const { currentTime, duration } = video

      if (duration > 0) {
        if (currentTime <= 0.5) {
          setVideoOpacity(currentTime / 0.5)
        } else if (currentTime >= duration - 0.5) {
          setVideoOpacity((duration - currentTime) / 0.5)
        } else {
          setVideoOpacity(1)
        }
      }

      frameId = requestAnimationFrame(monitorVideoLoop)
    }

    const handleVideoEnded = () => {
      setVideoOpacity(0)
      timeoutId = window.setTimeout(() => {
        if (video) {
          video.currentTime = 0
          void video.play().catch((error) => console.log('Autoplay prevented:', error))
        }
      }, 100)
    }

    video.addEventListener('ended', handleVideoEnded)
    frameId = requestAnimationFrame(monitorVideoLoop)

    return () => {
      video.removeEventListener('ended', handleVideoEnded)
      cancelAnimationFrame(frameId)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
    }
  }

  const workflowSteps = [
    { icon: Search, title: "Explore", desc: "Browse destinations and discover travel agencies", color: "from-emerald-500 to-teal-500" },
    { icon: Compass, title: "Get Matched", desc: "Our engine finds the best agencies for your trip", color: "from-orange-500 to-amber-500" },
    { icon: Users, title: "Connect", desc: "Contact agencies via chat, call, or booking form", color: "from-violet-500 to-purple-500" },
    { icon: ShieldCheck, title: "Book & Travel", desc: "Confirm your trip and enjoy seamless travel", color: "from-emerald-600 to-green-500" },
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FFFFFF] dark:bg-background font-['Inter']">
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F4C8A0]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#B7D7FF]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#D8F0D1]/20 blur-3xl" />

        <div
          className="absolute inset-x-0 bottom-0 z-0 overflow-hidden"
          style={{ top: '280px' }}
        >
          <video
            ref={videoRef}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: videoOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-white/30 to-[#FFFFFF] dark:from-background dark:via-background/30 dark:to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.15)_58%,rgba(255,255,255,0.95)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.15)_58%,rgba(0,0,0,0.95)_100%)]" />
        </div>

        <section
          className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ paddingTop: '6rem', paddingBottom: '8rem' }}
        >
          <div className="inline-flex items-center rounded-full border border-[#E7B98C]/80 bg-white/70 dark:bg-white/10 px-5 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#A85F26] shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md animate-fade-rise">
            Discover India&apos;s Hidden Gems
          </div>

          <h1
            className="mt-6 max-w-5xl font-['Instrument_Serif'] text-5xl font-normal leading-[0.9] tracking-[-0.045em] text-[#120D0B] dark:text-white sm:text-7xl lg:text-[7rem] animate-fade-rise-delay"
          >
            Your TRIPMATE <span className="block">Companion</span> for India Tour
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#5F5A57] dark:text-white/60 sm:text-lg animate-fade-rise-delay-2">
            From the Himalayas to the backwaters, from ancient temples to vibrant beaches. Explore incredible India with personalized recommendations and verified travel agencies.
          </p>

          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 animate-fade-rise-delay-2">
            <Link
              href="/explore"
              className="rounded-full bg-[#111111] px-10 py-4 text-sm font-medium text-[#FFFFFF] shadow-[0_18px_40px_rgba(17,17,17,0.18)] transition-transform hover:scale-[1.03]"
            >
              Begin Journey
            </Link>
            <Link
              href="/agencies"
              className="rounded-full border-2 border-orange-500/50 bg-orange-500/10 px-8 py-3.5 text-sm font-medium text-orange-700 dark:text-orange-300 transition-all hover:bg-orange-500/20 hover:scale-[1.03] flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Find Travel Agencies
            </Link>
          </div>
          <div className="text-sm text-[#6F6F6F] mt-3">
            Personalized routes, stays, and local insights
          </div>
        </section>
      </div>

      {/* How TRIPMATE Works */}
      <section className="py-16 px-4 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              How <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">TRIPMATE</span> Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From discovery to booking — we connect you with the perfect travel agency in 4 simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-500 via-orange-500 to-green-500 opacity-20" />

            {workflowSteps.map((step, i) => (
              <div key={i} className={`relative text-center p-6 rounded-2xl bg-background border border-border/50 shadow-sm animate-slide-up-delay-${i + 1} agency-card-hover`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-lg z-10">
                  {i + 1}
                </div>
                <div className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center mb-4 shadow-lg`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agencies Carousel */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Top Travel Agencies</h2>
              <p className="text-muted-foreground text-sm mt-1">Verified partners trusted by thousands of travelers</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => scrollCarousel('left')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => scrollCarousel('right')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Link href="/agencies">
                <Button variant="ghost" size="sm" className="gap-1.5 ml-2">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredAgencies.map(agency => (
              <div key={agency.id} className="min-w-[310px] max-w-[340px] snap-start shrink-0">
                <AgencyCard agency={agency} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Agency Spotlight */}
      <section className="px-4">
        <div className="container mx-auto">
          {eliteAgency && <AgencyAdBanner agency={eliteAgency} variant="inline" />}
        </div>
      </section>

      {/* Revenue Showcase / For Agencies Section */}
      <RevenueShowcase />

      <Footer />
    </div>
  )
}

export default App
