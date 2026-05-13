"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const [agency, setAgency] = useState<any>(null)
  const [fileUrl, setFileUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [docType, setDocType] = useState('BUSINESS_REGISTRATION')

  useEffect(() => {
    const f = async () => {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/agencies/me', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      if (!res.ok) return
      const data = await res.json()
      setAgency(data.data)
    }
    f()
  }, [])

  const handleUpload = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/agencies/documents', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ agencyId: agency.id, docType, fileUrl, fileName }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success('Document saved')
      setFileUrl(''); setFileName('')
      const r2 = await fetch('/api/agencies/me', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      const d2 = await r2.json()
      setAgency(d2.data)
    } catch (err: any) {
      toast.error(err.message || 'Failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Documents</h1>
      <div className="mt-4">
        {agency && <div className="mb-4">Agency: {agency.agencyName}</div>}
        <div className="space-y-2">
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="p-2">
            <option value="BUSINESS_REGISTRATION">Business Registration</option>
            <option value="GST_CERTIFICATE">GST Certificate</option>
            <option value="PAN_CARD">PAN Card</option>
            <option value="TOURISM_LICENSE">Tourism License</option>
            <option value="IDENTITY_PROOF">Identity Proof</option>
            <option value="ADDRESS_PROOF">Address Proof</option>
          </select>
          <input placeholder="File URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="w-full p-2" />
          <input placeholder="File name" value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full p-2" />
          <button onClick={handleUpload} className="rounded bg-primary px-3 py-2 text-white">Save Document</button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Uploaded Documents</h3>
          <ul className="mt-2">
            {(agency?.documentsSubmitted || []).map((d: any) => (
              <li key={d.id}><a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-primary">{d.fileName}</a> — {d.docType}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
