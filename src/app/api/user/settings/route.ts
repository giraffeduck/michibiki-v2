// src/app/api/user/settings/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()

  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  })

  const payload = await req.json()

  const {
    week_start_day,
    timezone,
    gender,
    birth_date,
    email,
    weight_kg,
    ftp,
    run_5k_time,
    swim_400m_time,
  } = payload

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log('[settings API] payload:', payload)
  console.log('[settings API] supabase user:', user)
  if (!user) {
    console.error('[settings API] Auth error:', authError)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error: upsertError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      week_start_day,
      timezone,
      gender,
      birth_date,
      email,
      weight_kg,
      ftp,
      run_5k_time,
      swim_400m_time,
    })

  if (upsertError) {
    console.error('[settings API] Upsert error:', upsertError)
    return NextResponse.json({ error: 'Failed to save user settings' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Settings saved successfully' })
}
