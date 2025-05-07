'use client'

import { useEffect, useState } from 'react'

export default function UsageStats() {
  const [pharmacy, setPharmacy] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPharmacy = async () => {
      try {
        const res = await fetch('/api/pharmacy/get-my-pharmacy')
        if (!res.ok) throw new Error('Failed to fetch pharmacy')

        const data = await res.json()
        setPharmacy(data) 
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPharmacy()
  }, [])
  if (loading) return <div>Loading stats...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!pharmacy) return <div>No data found</div>

  const deliveriesUsed = pharmacy.deliveries_used || 0
  const plan = pharmacy.planType + ' - ' + pharmacy.planName
  const total = pharmacy.allocated_deliveries || 0
  const remaining = total - deliveriesUsed

  return (
    <div className="bg-[#111] border border-red-600 rounded p-4">
      <h2 className="text-xl font-bold mb-2">Usage Stats</h2>
      <p>Total Deliveries This Month: <span className="text-red-400">{deliveriesUsed}</span></p>
      <p>Plan: <span className="text-red-400">{plan}</span></p>
      <p>Deliveries Left: <span className="text-red-400">{remaining}</span></p>
    </div>
  )
}
