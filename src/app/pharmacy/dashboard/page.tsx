'use client'

import { useState } from 'react'
import Calendar from '../../components/Calendar'
import DeliveryHistory from '../../components/DeliveryHistory'
import UsageStats from '../../components/UsageStats'
import QuickActions from '../../components/QuickActions'
import AccountInfo from '../../components/AccountInfo'

export default function PharmacyDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Pharmacy Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageStats />
        <AccountInfo />
      </div>

      <QuickActions />

      <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <DeliveryHistory />
    </div>
  )
}
