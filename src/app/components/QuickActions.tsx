// components/QuickActions.tsx
'use client'

import usePharmacy from '@/hooks/usePharmacy'
import { useRouter } from 'next/navigation'

export default function QuickActions() {
  const pharmacy = usePharmacy()
  const router = useRouter()

  if (!pharmacy) return null

  const isSubscription = pharmacy.plan_type === 'subscription'

  return (
    <div className="bg-[#111] border border-red-600 rounded p-4 flex flex-wrap gap-4">
      <button
        onClick={() => router.push('/pharmacy/schedule-delivery')}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
      >
        Schedule Delivery
      </button>

      <button
        disabled={!isSubscription}
        onClick={() => router.push('/pharmacy/request-delivery')}
        className={`px-4 py-2 rounded text-white ${
          isSubscription
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-700 cursor-not-allowed'
        }`}
      >
        Request Delivery
      </button>

      {!isSubscription && (
        <p className="text-sm text-gray-400">
          * Express delivery is only available on subscription plans.
        </p>
      )}
    </div>
  )
}
