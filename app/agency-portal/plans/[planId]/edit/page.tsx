"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function EditPlan({ params }: { params: { planId: string } }) {
  const { planId } = params
  const [plan, setPlan] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPlan = async () => {
      const res = await fetch(`/api/agencies/plans/browse?`) // placeholder
      // For now, keep it simple
    }
    fetchPlan()
  }, [planId])

  const handleSave = async () => {
    toast('Save not yet implemented')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Edit Plan</h1>
      <div className="mt-4">
        <p>Editing {planId}</p>
        <button onClick={handleSave} className="rounded bg-primary px-3 py-2 text-white">Save</button>
      </div>
    </div>
  )
}
