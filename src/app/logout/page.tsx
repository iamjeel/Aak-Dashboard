'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRole } from '@/context/RoleContext'

export default function Logout() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { setRole } = useRole()

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      setRole('pharmacy') // reset to default
      router.push('/login')
    }

    logout()
  }, [router, setRole, supabase])

  return (
    <main className="h-screen flex items-center justify-center text-white bg-black">
      <p>Logging you out...</p>
    </main>
  )
}
