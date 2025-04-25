'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRole } from '@/context/RoleContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const Sidebar = () => {
  const { role, setRole } = useRole()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
        setRole(isAdmin ? 'admin' : 'pharmacy')
      }
    }

    fetchRole()
  }, [setRole])

  return (
    <aside className="w-64 h-screen bg-black border-r border-red-500 p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6 text-red-500">AAK Deliveries</h2>

      <nav className="space-y-4 text-white">
        {role === 'admin' ? (
          <>
            <Link href="/admin/dashboard" className="block hover:text-red-500">
              🛠️ Admin Dashboard
            </Link>
            <Link href="/admin/pharmacies" className="block hover:text-red-500">
              🏥 Manage Pharmacies
            </Link>
          </>
        ) : role === 'pharmacy' ? (
          <>
            <Link href="/pharmacy/dashboard" className="block hover:text-red-500">
              📊 Pharmacy Dashboard
            </Link>
            <Link href="/pharmacy/request-delivery" className="block hover:text-red-500">
              📦 Request Delivery
            </Link>
          </>
        ) : null}

        <Link href="/logout" className="block mt-10 text-sm text-gray-400 hover:text-white">
          Log Out
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
