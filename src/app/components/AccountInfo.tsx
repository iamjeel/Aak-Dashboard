'use client'

import usePharmacy from '@/hooks/usePharmacy'

export default function AccountInfo() {
  const pharmacy = usePharmacy()

  if (!pharmacy) return <div>Loading account...</div>

  return (
    <div className="bg-[#111] border border-red-600 rounded p-4">
      <h2 className="text-xl font-bold mb-2">Account Info</h2>
      <p>Pharmacy Name: <span className="text-red-400">{pharmacy.username}</span></p>
      <p>Username: <span className="text-red-400">{pharmacy.username}</span></p>
      <p>Email: <span className="text-red-400">{pharmacy.email}</span></p>
    </div>
  )
}
