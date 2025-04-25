'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import toast from 'react-hot-toast'

type PlanType = 'subscription' | 'punch_card'

const PLAN_DELIVERIES: Record<PlanType, Record<string, number>> = {
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

type Props = {
  pharmacy: {
    id: string
    username: string
    email: string
    user_id: string
    plan_type: PlanType | null
    plan_name: string | null
    deliveries_allocated: number | null
  }
  onClose: () => void
  onSave: () => void
}

export default function EditPharmacyModal({ pharmacy, onClose, onSave }: Props) {
  const supabase = createClientComponentClient<Database>()

  const [form, setForm] = useState({
    email: pharmacy.email,
    username: pharmacy.username,
    plan_type: pharmacy.plan_type || 'subscription',
    plan_name:
      pharmacy.plan_name ||
      Object.keys(PLAN_DELIVERIES[pharmacy.plan_type || 'subscription'])[0],
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setForm((prev) => {
      if (name === 'plan_type') {
        const defaultPlanName = Object.keys(PLAN_DELIVERIES[value as PlanType])[0]
        return {
          ...prev,
          plan_type: value,
          plan_name: defaultPlanName,
        }
      }

      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)

    const { email, username, plan_type, plan_name } = form
    const deliveries_allocated = PLAN_DELIVERIES[plan_type as PlanType][plan_name]

    try {
      // Update email in Supabase Auth
      const res = await fetch('/api/update-pharmacy-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: pharmacy.user_id, email }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }

      // Update pharmacy DB entry
      const { error } = await supabase
        .from('pharmacies')
        .update({ email, username, plan_type, plan_name, deliveries_allocated })
        .eq('id', pharmacy.id)

      if (error) throw new Error(error.message)

      toast.success('Pharmacy updated successfully')
      onSave()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update pharmacy')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#111] border border-red-500 p-6 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Edit Pharmacy</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-4">
          {['email', 'username'].map((field) => (
            <div key={field}>
              <label className="text-white capitalize">{field}</label>
              <input
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                value={(form as any)[field]}
                onChange={handleChange}
                required
                className="w-full p-2 border border-red-500 bg-black text-white"
              />
            </div>
          ))}

          <div>
            <label className="text-white">Plan Type</label>
            <select
              name="plan_type"
              value={form.plan_type}
              onChange={handleChange}
              className="w-full p-2 border border-red-500 bg-black text-white"
            >
              {Object.keys(PLAN_DELIVERIES).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white">Plan Name</label>
            <select
              name="plan_name"
              value={form.plan_name}
              onChange={handleChange}
              className="w-full p-2 border border-red-500 bg-black text-white"
            >
              {Object.keys(PLAN_DELIVERIES[form.plan_type as PlanType]).map((plan) => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white">Allocated Deliveries</label>
            <input
              type="number"
              value={PLAN_DELIVERIES[form.plan_type as PlanType][form.plan_name]}
              readOnly
              className="w-full p-2 border border-red-500 bg-black text-white cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
