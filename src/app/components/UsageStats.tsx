'use client'

import usePharmacy from '@/hooks/usePharmacy'

export default function UsageStats() {
  const pharmacy = usePharmacy()

  if (!pharmacy) return <div>Loading stats...</div>

  const deliveriesUsed = pharmacy.deliveries_used || 0
  const plan = pharmacy.plan_type + ' - ' + pharmacy.plan_name
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
