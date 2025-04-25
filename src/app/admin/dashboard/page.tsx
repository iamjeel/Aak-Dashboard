'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

export default function AdminDashboardPage() {
  const supabase = createClientComponentClient<Database>()
  const [pharmacies, setPharmacies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    newOrdersToday: 0,
    totalPharmacies: 0,
    deliveriesThisMonth: 0,
    pendingDeliveries: 0,
  })

  const [zoneData, setZoneData] = useState<{ zone: string; deliveries: number }[]>([])
  const [teamData, setTeamData] = useState<{ team: string; deliveries: number }[]>([])

  useEffect(() => {
    fetchPharmacies()
    fetchStats()
    fetchChartData()
  }, [])

  const fetchPharmacies = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('pharmacies').select('*')
    if (error) {
      toast.error('Failed to fetch pharmacies')
    } else {
      setPharmacies(data)
      setStats((prev) => ({ ...prev, totalPharmacies: data.length }))
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0]
    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)
    const startOfMonth = firstOfMonth.toISOString().split('T')[0]

    const { count: newOrdersToday } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('scheduled_for', today)

    const { count: deliveriesThisMonth } = await supabase
      .from('deliveries')
      .select('*', { count: 'exact', head: true })
      .gte('date', startOfMonth)
      .lte('date', today)

    const { count: pendingDeliveries } = await supabase
      .from('deliveries')
      .select('*', { count: 'exact', head: true })
      .gte('date', today)

    setStats((prev) => ({
      ...prev,
      newOrdersToday: newOrdersToday ?? 0,
      deliveriesThisMonth: deliveriesThisMonth ?? 0,
      pendingDeliveries: pendingDeliveries ?? 0,
    }))
  }

  const fetchChartData = async () => {
    const { data: deliveries } = await supabase.from('deliveries').select('zone, team_name, quantity')

    const zoneMap: Record<string, number> = {}
    const teamMap: Record<string, number> = {}

    deliveries?.forEach((d) => {
      const zone = d.zone || 'Unassigned'
      const team = d.team_name || 'Unassigned'
      zoneMap[zone] = (zoneMap[zone] || 0) + (d.quantity || 0)
      teamMap[team] = (teamMap[team] || 0) + (d.quantity || 0)
    })

    setZoneData(Object.entries(zoneMap).map(([zone, deliveries]) => ({ zone, deliveries })))
    setTeamData(Object.entries(teamMap).map(([team, deliveries]) => ({ team, deliveries })))
  }

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    error ? toast.error('Reset email failed') : toast.success('Reset email sent')
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="New Orders Today" value={stats.newOrdersToday} />
        <StatCard label="Total Pharmacies" value={stats.totalPharmacies} />
        <StatCard label="Deliveries This Month" value={stats.deliveriesThisMonth} />
        <StatCard label="Pending Deliveries" value={stats.pendingDeliveries} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ChartCard title="Deliveries by Zone" data={zoneData} dataKey="zone" />
        <ChartCard title="Deliveries by Team" data={teamData} dataKey="team" />
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black border border-red-500">
            <thead>
              <tr className="text-left border-b border-red-500">
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Plan</th>
                <th className="p-2">Allocated</th>
                <th className="p-2">Used</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.map((pharmacy) => (
                <tr key={pharmacy.id} className="border-b border-red-500">
                  <td className="p-2">{pharmacy.username}</td>
                  <td className="p-2">{pharmacy.email}</td>
                  <td className="p-2">{pharmacy.plan_type} - {pharmacy.plan_name}</td>
                  <td className="p-2">{pharmacy.deliveries_allocated}</td>
                  <td className="p-2">{pharmacy.deliveries_used ?? '-'}</td>
                  <td className="p-2">
                    <button
                      className="border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-black"
                      onClick={() => handleResetPassword(pharmacy.email)}
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// --- Components ---
function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-black border border-red-500 p-4 rounded shadow text-center">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    </div>
  )
}

function ChartCard({
  title,
  data,
  dataKey,
}: {
  title: string
  data: { [key: string]: string | number }[]
  dataKey: string
}) {
  return (
    <div className="bg-black border border-red-500 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="deliveries" fill="#e11d48" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
