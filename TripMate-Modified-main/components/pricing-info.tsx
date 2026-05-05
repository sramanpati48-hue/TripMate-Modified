"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { getCurrentPricingFactors } from "@/lib/pricing"

export function PricingInfo() {
  const factors = getCurrentPricingFactors()
  
  const getPricingStatus = () => {
    const totalMultiplier = factors.seasonMultiplier * factors.demandMultiplier * factors.holidayMultiplier
    
    if (totalMultiplier >= 1.5) return { label: "Peak Pricing", color: "destructive", icon: TrendingUp }
    if (totalMultiplier >= 1.2) return { label: "High Demand", color: "default", icon: TrendingUp }
    if (totalMultiplier <= 0.8) return { label: "Best Deals", color: "secondary", icon: TrendingDown }
    return { label: "Normal Rates", color: "outline", icon: Calendar }
  }
  
  const status = getPricingStatus()
  const Icon = status.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={status.color as any} className="cursor-help gap-1.5 px-2.5 py-1">
            <Icon className="h-3 w-3" />
            {status.label}
            <Info className="h-3 w-3 ml-0.5 opacity-70" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3" side="bottom">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Current Pricing Factors:</p>
            <ul className="text-xs space-y-1.5">
              <li className="flex items-center justify-between">
                <span>Season:</span>
                <span className="font-medium">{factors.season}</span>
              </li>
              {factors.isHoliday && (
                <li className="flex items-center justify-between text-orange-500">
                  <span>Holiday Period:</span>
                  <span className="font-medium">+50%</span>
                </li>
              )}
              {factors.isWeekend && !factors.isHoliday && (
                <li className="flex items-center justify-between text-blue-500">
                  <span>Weekend:</span>
                  <span className="font-medium">+20%</span>
                </li>
              )}
              {factors.season === 'Monsoon' && (
                <li className="flex items-center justify-between text-green-500">
                  <span>Off-season:</span>
                  <span className="font-medium">-30%</span>
                </li>
              )}
            </ul>
            <p className="text-xs text-muted-foreground pt-1 border-t">
              Prices update in real-time based on season, demand, and special events.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Simplified inline version without tooltip for smaller spaces
export function PricingBadge() {
  const factors = getCurrentPricingFactors()
  const totalMultiplier = factors.seasonMultiplier * factors.demandMultiplier * factors.holidayMultiplier
  
  if (totalMultiplier >= 1.5) {
    return <Badge variant="destructive" className="text-xs">Peak Season</Badge>
  }
  if (totalMultiplier >= 1.2) {
    return <Badge variant="default" className="text-xs">High Demand</Badge>
  }
  if (totalMultiplier <= 0.8) {
    return <Badge variant="secondary" className="text-xs">Best Deals</Badge>
  }
  return null
}
