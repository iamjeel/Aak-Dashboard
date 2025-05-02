'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const planDeliveries: Record<string, Record<string, number>> = {
  subscription: {
    Basic: 500,
    Standard: 1000,
    Premium: 1500,
  },
  punch_card: {
    '250': 250,
    '500': 500,
    '750': 750,
  },
}

export default function UpdatePharmacyModal({ isOpen, onClose, pharmacy }: { isOpen: boolean; onClose: () => void, pharmacy: any }) {
  const router = useRouter()

  const defaultPlanType = 'subscription'
  const defaultPlanName = Object.keys(planDeliveries[defaultPlanType])[0]

  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    pharmacy_name: '',
    contact_name: '',
    phone: '',
    address: '',
    timezone: '',
    plan_type: defaultPlanType,
    plan_name: defaultPlanName,
    allocated_deliveries: planDeliveries[defaultPlanType][defaultPlanName],
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setForm((prev) => ({ ...prev, timezone: tz }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setForm((prev) => {
      if (name === 'plan_type') {
        const newPlanName = Object.keys(planDeliveries[value])[0]
        const newDeliveries = planDeliveries[value][newPlanName]
        return {
          ...prev,
          plan_type: value,
          plan_name: newPlanName,
          allocated_deliveries: newDeliveries,
        }
      }

      if (name === 'plan_name') {
        const newDeliveries = planDeliveries[form.plan_type][value]
        return {
          ...prev,
          plan_name: value,
          allocated_deliveries: newDeliveries,
        }
      }

      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
        ...form,
        pharmacy_id: pharmacy._id, // VERY IMPORTANT: Pass pharmacy_code
      };

    const res = await fetch('/api/pharmacy/update-pharmacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()

    if (!res.ok) {
      toast.error(`Error: ${result.error}`)
      setLoading(false)
      return
    }

    toast.success('Pharmacy updated successfully!')
    setLoading(false)
    router.refresh()
    onClose()
  }

  if (!isOpen) return null

  return (
<div className="fixed inset-10 flex items-center justify-center bg-black/90 ">
      <div className="bg-black border border-red-500 rounded-lg p-8 w-full max-w-lg text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-400">
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">Update Pharmacy</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-red-500 bg-black text-white rounded"
            />
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Username</label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full p-2 border border-red-500 bg-black text-white rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-2 border border-red-500 bg-black text-white rounded"
              />
            </div>
          </div>

          {/* Pharmacy Name */}
          <div>
            <label className="block font-semibold mb-1">Pharmacy Name</label>
            <input
              name="pharmacy_name"
              type="text"
              value={form.pharmacy_name}
              onChange={handleChange}
              className="w-full p-2 border border-red-500 bg-black text-white rounded"
            />
          </div>

          {/* Contact Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Contact Name</label>
              <input
                name="contact_name"
                type="text"
                value={form.contact_name}
                onChange={handleChange}
                className="w-full p-2 border border-red-500 bg-black text-white rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2 border border-red-500 bg-black text-white rounded"
              />
            </div>
          </div>

          {/* Address & Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Address</label>
              <input
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className="w-full p-2 border border-red-500 bg-black text-white rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Timezone</label>
              <input
                name="timezone"
                type="text"
                value={form.timezone}
                readOnly
                className="w-full p-2 border border-red-500 bg-black text-white rounded cursor-not-allowed"
              />
            </div>
          </div>

          {/* Plan Type & Plan Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Plan Type</label>
              <select
                name="plan_type"
                value={form.plan_type}
                onChange={handleChange}
                className="w-full p-2 border border-red-500 bg-black text-white rounded"
              >
                <option value="subscription">Subscription</option>
                <option value="punch_card">Punch Card</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Plan Name</label>
              <select
                name="plan_name"
                value={form.plan_name}
                onChange={handleChange}
                className="w-full p-2 border border-red-500 bg-black text-white rounded"
              >
                {Object.keys(planDeliveries[form.plan_type]).map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Allocated Deliveries */}
          <div>
            <label className="block font-semibold mb-1">Allocated Deliveries</label>
            <input
              name="allocated_deliveries"
              type="number"
              value={form.allocated_deliveries}
              readOnly
              className="w-full p-2 border border-red-500 bg-black text-white rounded cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white disabled:opacity-50 w-full"
            >
              {loading ? 'Updating...' : 'Update Pharmacy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
