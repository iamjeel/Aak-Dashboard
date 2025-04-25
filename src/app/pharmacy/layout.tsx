'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import ClientWrapper from '../components/ClientWrapper'


export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const { data: pharmacy } = await supabase
        .from('pharmacies')
        .select('id')
        .eq('user_id', session?.user.id)
        .single()

      if (!session || !pharmacy) {
        redirect('/login')
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) return <div className="text-white p-6">Loading...</div>

  return <ClientWrapper>{children}</ClientWrapper>
}
