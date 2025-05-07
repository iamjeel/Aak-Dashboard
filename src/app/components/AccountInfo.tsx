'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AccountInfo() {
  const { data: session, status }: any = useSession()
  const [pharmacy, setPharmacy] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPharmacy = async () => {
      if (!session?.user?.email) return

      try {
        const res = await fetch('/api/pharmacy/get-my-pharmacy')
        if (!res.ok) throw new Error('Failed to fetch pharmacy')
        const data = await res.json()
        setPharmacy(data)
      } catch (err) {
        console.error('Error fetching pharmacy:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPharmacy()
  }, [session])

  if (loading) return <div>Loading account...</div>
  if (!pharmacy) return <div>No pharmacy info found.</div>

  return (
    <div className="bg-[#111] border border-red-600 rounded p-4">
      <h2 className="text-xl font-bold mb-2">Account Info</h2>
      <p>Pharmacy Name: <span className="text-red-400">{pharmacy.username}</span></p>
      <p>Username: <span className="text-red-400">{pharmacy.username}</span></p>
      <p>Email: <span className="text-red-400">{pharmacy.email}</span></p>
    </div>
  )
}
