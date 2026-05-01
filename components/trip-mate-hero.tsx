"use client"

import { useEffect, useRef } from "react"
import { Sparkles } from "lucide-react"

type TripMateHeroProps = {
  activeTab: "manual" | "ai"
  onTabChange: (tab: "manual" | "ai") => void
}

const TripMateHero = ({ activeTab, onTabChange }: TripMateHeroProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fadingOutRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const fadeVideo = (targetOpacity: number, duration: number, onComplete?: () => void) => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      const startOpacity = Number.parseFloat(video.style.opacity) || 0
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        video.style.opacity = String(startOpacity + (targetOpacity - startOpacity) * progress)

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else if (onComplete) {
          onComplete()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handleLoadedData = () => {
      fadeVideo(1, 250)
    }

    const handleTimeUpdate = () => {
      if (video.duration - video.currentTime <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true
        fadeVideo(0, 250, () => {
          window.setTimeout(() => {
            video.currentTime = 0
            void video.play()
            fadingOutRef.current = false
            fadeVideo(1, 250)
          }, 100)
        })
      }
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("timeupdate", handleTimeUpdate)

    video.style.opacity = "0"
    void video.play().catch((error) => console.log("Autoplay prevented:", error))

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("timeupdate", handleTimeUpdate)

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="relative mt-4 flex h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl font-['Schibsted_Grotesk']">
      <video
        ref={videoRef}
        muted
        playsInline
        className="absolute top-0 left-1/2 -z-10 h-[115%] w-[115%] -translate-x-1/2 object-cover object-top"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.28)_0%,rgba(255,244,231,0.08)_38%,rgba(255,255,255,0.24)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_38%)]" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-[120px] -mt-[50px]">
        <div className="mb-[34px] flex w-max items-center rounded-full border border-orange-200 bg-white/80 p-1 pr-3 shadow-xl backdrop-blur-xl">
          <div className="mr-2 flex items-center justify-center rounded-full bg-[#0e1311] px-2 py-1 text-white">
            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium tracking-wide">New</span>
          </div>
          <span className="font-['Inter'] text-sm text-slate-700">Discover what&apos;s possible with TripMate AI</span>
        </div>

        <h1 className="mb-[34px] text-center font-['Fustat'] text-[80px] font-bold leading-none tracking-[-4.8px] text-slate-950 drop-shadow-[0_8px_24px_rgba(255,255,255,0.55)]">
          Explore India Quickly
        </h1>

        <p className="mb-[44px] w-[542px] max-w-[736px] text-center font-['Fustat'] text-[20px] font-medium tracking-[-0.4px] text-slate-700 drop-shadow-[0_4px_18px_rgba(255,255,255,0.5)]">
          Upload your preferences and get a powerful itinerary right away. Work smarter and plan your Indian adventure effortlessly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onTabChange("manual")}
            className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition ${
              activeTab === "manual"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "border border-orange-200 bg-white/90 text-slate-800 hover:bg-orange-50"
            }`}
          >
            Manual Trip Planner
          </button>
          <button
            onClick={() => onTabChange("ai")}
            className={`inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold transition ${
              activeTab === "ai"
                ? "border-orange-500 bg-orange-500/15 text-slate-900"
                : "border-orange-200 bg-white/80 text-slate-800 hover:bg-orange-50"
            }`}
          >
            AI Trip Planner
            <Sparkles className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripMateHero