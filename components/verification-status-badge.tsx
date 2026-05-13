import React from 'react'
import { ShieldCheck } from 'lucide-react'

export default function VerificationStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PENDING':
      return <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-300">Pending Review</span>
    case 'UNDER_REVIEW':
      return <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">Under Review</span>
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-xs font-semibold text-teal-300">
          <ShieldCheck className="h-4 w-4" />
          Verified
        </span>
      )
    case 'REJECTED':
      return <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">Application Rejected</span>
    case 'SUSPENDED':
      return <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70">Suspended</span>
    default:
      return <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-300">Pending</span>
  }
}
