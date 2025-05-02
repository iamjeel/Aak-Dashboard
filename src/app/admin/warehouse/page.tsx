'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CreateWarehouseAdminPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'warehouseAdmin',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/users/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const result = await res.json()

    if (!res.ok) {
      toast.error(`Error: ${result.error}`)
      setLoading(false)
      return
    }

    toast.success('Warehouse admin created successfully!')
    setLoading(false)
    router.push('/admin/dashboard')
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Create Warehouse Admin</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-red-500 bg-black text-white rounded"
          />
        </div>

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

        {/* Password */}
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

        {/* Phone */}
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

        {/* Role (read-only) */}
        <div>
          <label className="block font-semibold mb-1">Role</label>
          <input
            name="role"
            type="text"
            value={form.role}
            readOnly
            className="w-full p-2 border border-red-500 bg-black text-white rounded cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white disabled:opacity-50 w-full"
          >
            {loading ? 'Creating...' : 'Create Warehouse Admin'}
          </button>
        </div>
      </form>
    </div>
  )
}
