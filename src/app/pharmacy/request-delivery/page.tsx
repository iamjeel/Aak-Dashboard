'use client'

import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Confetti from 'react-confetti'
import usePharmacy from '@/hooks/usePharmacy'

const REQUIRED_COLUMNS = [
  'Pharmacy Name',
  'Recipient Name',
  'Phone Number',
  'Address Line 1',
  'City',
  'State',
  'Postal Code',
  'Delivery Team'
]

export default function RequestDeliveryPage() {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const pharmacy = usePharmacy()
  const supabase = createClientComponentClient()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const uploaded = e.dataTransfer.files[0]
    handleFile(uploaded)
  }

  const handleFile = (uploaded: File) => {
    if (!uploaded) return
    setFile(uploaded)

    Papa.parse(uploaded, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const missing = REQUIRED_COLUMNS.filter(
          (col) => !result.meta.fields?.includes(col)
        )
        if (missing.length > 0) {
          setError(`Missing columns: ${missing.join(', ')}`)
          setData([])
          return
        }

        setError('')
        setData(result.data as any[])
      },
      error: () => {
        setError('Failed to parse CSV')
        setData([])
      }
    })
  }

  const handleSubmit = async () => {
    if (!data.length) return

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user
    if (!user) return

    const { error } = await supabase
      .from('deliveries')
      .insert(data.map((item) => ({
        ...item,
        user_id: user.id,
        date: new Date().toISOString(),
        type: 'express'
      })))

    if (error) {
      toast.error('Failed to submit deliveries')
    } else {
      toast.success('Deliveries submitted!')
      setSuccess(true)
    }
  }

  if (!pharmacy) return <p className="text-white p-6">Loading...</p>

  const isSubscription = pharmacy.plan_type === 'subscription'

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      {success && <Confetti />}

      <h1 className="text-3xl font-bold mb-6">Request Express Delivery</h1>

      {!isSubscription && (
        <p className="bg-yellow-900 text-yellow-300 p-4 rounded border border-yellow-600 mb-6">
          ⚠️ Express delivery is only available for <strong>subscription plans</strong>. Please contact support to upgrade.
        </p>
      )}
      <p className="text-gray-300 mb-4">
  Upload a CSV file with the following columns. Here's a sample of what your file should look like:
</p>

<div className="overflow-x-auto mb-6 border border-red-600 rounded bg-[#111]">
  <table className="w-full text-sm">
    <thead>
      <tr className="text-red-400">
        <th className="border border-red-600 px-2 py-1 text-left">Pharmacy Name</th>
        <th className="border border-red-600 px-2 py-1 text-left">Recipient Name</th>
        <th className="border border-red-600 px-2 py-1 text-left">Phone Number</th>
        <th className="border border-red-600 px-2 py-1 text-left">Address Line 1</th>
        <th className="border border-red-600 px-2 py-1 text-left">City</th>
        <th className="border border-red-600 px-2 py-1 text-left">State</th>
        <th className="border border-red-600 px-2 py-1 text-left">Postal Code</th>
        <th className="border border-red-600 px-2 py-1 text-left">Delivery Team</th>
      </tr>
    </thead>
    <tbody>
      <tr className="text-white">
        <td className="border border-red-800 px-2 py-1">HealthRx #302</td>
        <td className="border border-red-800 px-2 py-1">John Doe</td>
        <td className="border border-red-800 px-2 py-1">1234567890</td>
        <td className="border border-red-800 px-2 py-1">123 Elm Street</td>
        <td className="border border-red-800 px-2 py-1">Toronto</td>
        <td className="border border-red-800 px-2 py-1">ON</td>
        <td className="border border-red-800 px-2 py-1">M5V 2T6</td>
        <td className="border border-red-800 px-2 py-1">Team A</td>
      </tr>
    </tbody>
  </table>
</div>


      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full p-6 border-2 border-dashed border-red-600 bg-[#111] rounded text-center mb-6 cursor-pointer"
      >
        {file ? (
          <p className="text-red-400">{file.name} uploaded ✔</p>
        ) : (
          <p className="text-gray-400">Drag & drop your CSV file here</p>
        )}
      </div>

      {error && (
        <div className="text-red-400 mb-4 border border-red-600 bg-[#220000] p-3 rounded">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="overflow-x-auto mb-6 border border-red-600 rounded">
          <table className="w-full text-sm bg-[#111]">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="border border-red-600 px-2 py-1 text-left text-red-400">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map((key) => (
                    <td key={key} className="border border-red-800 px-2 py-1">
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isSubscription || !data.length}
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded disabled:opacity-40"
      >
        Submit Deliveries
      </button>
    </div>
  )
}
