"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'

export default function BookingWidget({ plan }: { plan: any }) {
  const [startDate, setStartDate] = useState(plan?.startDates?.[0] || '')
  const [groupSize, setGroupSize] = useState(1)
  const [loading, setLoading] = useState(false)

  const total = (Number(plan?.pricePerPerson || 0) * Number(groupSize)).toFixed(2)

  const handleBook = async () => {
    if (!startDate) return toast.error('Please select a start date')
    if (groupSize < 1 || groupSize > plan.maxGroupSize) return toast.error('Invalid group size')

    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`/api/agencies/plans/${plan.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ startDate, groupSize }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      toast.success('Booking confirmed')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-white/8 bg-[#071019]/80 p-4">
      <h4 className="font-semibold text-white">Book this plan</h4>
      <div className="mt-3 space-y-3">
        <div>
          <label className="text-sm text-white/70">Start date</label>
          <select value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/5">
            {(plan.startDates || []).map((d: string) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">Group size</label>
          <input type="number" value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-white/5" min={1} max={plan.maxGroupSize} />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">Total</div>
          <div className="font-semibold text-white">₹{total}</div>
        </div>

        <Button onClick={handleBook} disabled={loading} className="w-full">{loading ? 'Booking...' : 'Book Now'}</Button>
      </div>
    </div>
  )
}
