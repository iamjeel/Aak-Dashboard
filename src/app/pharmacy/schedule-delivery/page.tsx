'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { toast } from 'sonner'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

type ScheduleRow = {
  date: string
  time: string
  recipient_name: string
  address: string
  phone: string
  notes?: string
  zone?: string
  team?: string
  pharmacy_name?: string
}

export default function ScheduleDeliveryPage() {
  const [data, setData] = useState<ScheduleRow[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = result.data as ScheduleRow[]
        const isValid = parsed.every(row =>
          row.date && row.time && row.recipient_name && row.address && row.phone
        )

        if (!isValid) {
          toast.error('Missing required columns in CSV file.')
          return
        }

        setData(parsed)
      },
    })
  }

  const handleSubmit = () => {
    toast.success('Scheduled deliveries submitted successfully!')
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 4000)

    // TODO: Send to backend or OnFleet integration
    console.log('Scheduled deliveries:', data)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {showConfetti && <Confetti width={width} height={height} />}
      <h1 className="text-3xl font-bold mb-8">📅 Schedule Deliveries</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Instructions */}
        <div className="bg-[#111] border border-red-600 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">CSV Format Instructions</h2>
          <p className="text-gray-300 mb-4">
            Upload a CSV file with your scheduled deliveries. Required columns:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 mb-4 space-y-1">
            <li><strong>date</strong> (YYYY-MM-DD)</li>
            <li><strong>time</strong> (e.g. 10:00 AM)</li>
            <li><strong>recipient_name</strong></li>
            <li><strong>address</strong></li>
            <li><strong>phone</strong></li>
            <li><strong>notes</strong> (optional)</li>
            <li><strong>zone</strong> (optional)</li>
            <li><strong>team</strong> (optional)</li>
            <li><strong>pharmacy_name</strong> (optional but recommended)</li>
          </ul>

          <h3 className="font-semibold mb-2">Example</h3>
          <div className="overflow-x-auto text-sm bg-black border border-red-600 rounded">
            <table className="w-full table-auto text-left">
              <thead className="bg-[#222] text-red-400">
                <tr>
                  <th className="p-2 border border-red-600">date</th>
                  <th className="p-2 border border-red-600">time</th>
                  <th className="p-2 border border-red-600">recipient_name</th>
                  <th className="p-2 border border-red-600">address</th>
                  <th className="p-2 border border-red-600">phone</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-red-600">2025-04-12</td>
                  <td className="p-2 border border-red-600">10:00 AM</td>
                  <td className="p-2 border border-red-600">Jane Doe</td>
                  <td className="p-2 border border-red-600">123 Main St</td>
                  <td className="p-2 border border-red-600">1234567890</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload + Preview */}
        <div>
          <div className="bg-[#111] border border-dashed border-red-600 p-6 rounded mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload CSV File</h2>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="text-white" />
          </div>

          {data.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Preview</h2>
              <div className="overflow-auto max-h-[300px] border border-red-600 rounded text-sm">
                <table className="min-w-full">
                  <thead className="bg-[#222] text-red-400">
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="px-2 py-1 border border-red-600 text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-2 py-1 border border-red-600">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.length > 0 && (
            <button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white font-semibold"
            >
              Submit Scheduled Deliveries
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
