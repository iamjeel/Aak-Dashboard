// hooks/usePharmacy.ts
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function usePharmacy() {
  const [pharmacy, setPharmacy] = useState<any>(null)

  useEffect(() => {
    const fetchPharmacy = async () => {
      const supabase = createClientComponentClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) return

      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (!error) {
        setPharmacy(data)
      }
    }

    fetchPharmacy()
  }, [])

  return pharmacy
}
