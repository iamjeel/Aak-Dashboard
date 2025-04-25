'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import ClientWrapper from '../components/ClientWrapper'


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // You can either check by email or use a custom `role` claim
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

      if (!session || session.user.email !== adminEmail) {
        redirect('/login')
      }

      setLoading(false)
    }

    checkAdminAuth()
  }, [])

  if (loading) return <div className="text-white p-6">Loading Admin...</div>

  return <ClientWrapper>{children}</ClientWrapper>
}
