import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    email,
    password,
    username,
    pharmacy_name,
    contact_name,
    phone,
    address,
    timezone,
    plan_type,
    plan_name,
    allocated_deliveries,
  } = body

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'pharmacy' },
    })

    if (authError || !authUser?.user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError?.message }, { status: 400 })
    }

    const user_id = authUser.user.id

    const { error: dbError } = await supabase.from('pharmacies').insert([
      {
        email,
        username,
        user_id,
        pharmacy_name,
        contact_name,
        phone,
        address,
        timezone,
        plan_type,
        plan_name,
        allocated_deliveries,
        deliveries_used: 0,
        rollover_balance: 0,
        same_day_limit: 0,
        role: 'pharmacy',
      },
    ])

    if (dbError) {
      console.error('DB error:', dbError)
      await supabase.auth.admin.deleteUser(user_id)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}
