"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoOpacity, setVideoOpacity] = useState(0)

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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FFFFFF] font-['Inter']">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-white/30 to-[#FFFFFF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.15)_58%,rgba(255,255,255,0.95)_100%)]" />
      </div>

      <section
        className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{ paddingTop: '8rem', paddingBottom: '10rem' }}
      >
        <div className="inline-flex items-center rounded-full border border-[#E7B98C]/80 bg-white/70 px-5 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#A85F26] shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md animate-fade-rise">
          Discover India&apos;s Hidden Gems
        </div>

        <h1
          className="mt-6 max-w-5xl font-['Instrument_Serif'] text-5xl font-normal leading-[0.9] tracking-[-0.045em] text-[#120D0B] sm:text-7xl lg:text-[7rem] animate-fade-rise-delay"
        >
          Your TRIPMATE <span className="block">Companion</span> for India Tour
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#5F5A57] sm:text-lg animate-fade-rise-delay-2">
          From the Himalayas to the backwaters, from ancient temples to vibrant beaches. Explore incredible India with personalized recommendations and local insights.
        </p>

        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 animate-fade-rise-delay-2">
          <Link
            href="/explore"
            className="rounded-full bg-[#111111] px-10 py-4 text-sm font-medium text-[#FFFFFF] shadow-[0_18px_40px_rgba(17,17,17,0.18)] transition-transform hover:scale-[1.03]"
          >
            Begin Journey
          </Link>
          <div className="text-sm text-[#6F6F6F]">
            Personalized routes, stays, and local insights
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
