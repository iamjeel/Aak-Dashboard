'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DeliveryHistory() {
  const supabase = createClientComponentClient()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const { data } = await supabase
        .from('deliveries')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('date', { ascending: false })
        .limit(5)

      setHistory(data || [])
    }

    fetchHistory()
  }, [])

  return (
    <div className="bg-[#111] border border-red-600 rounded p-4">
      <h2 className="text-xl font-bold mb-2">Recent Deliveries</h2>
      <ul className="space-y-2">
        {history.length === 0 && <p className="text-gray-400">No recent deliveries.</p>}
        {history.map((d, i) => (
          <li key={i} className="text-sm">
            <span className="text-red-400">{new Date(d.date).toLocaleDateString()}</span> — {d.total} deliveries ({d.circuit})
          </li>
        ))}
      </ul>
    </div>
  )
}
