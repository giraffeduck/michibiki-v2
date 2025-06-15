// src/app/api/user/settings/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
    headers,
  })

  const payload = await req.json()

  const {
    name,
    gender,
    birth_date,
    weight_kg,
    ftp,
    run_5k_time,
    swim_400m_time,
    week_start_day,
    email,
    timezone,
  } = payload

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication failed', details: userError }, { status: 401 })
  }

  const { error: upsertError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      name,
      gender,
      birth_date,
      weight_kg,
      ftp,
      run_5k_time,
      swim_400m_time,
      week_start_day,
      email,
      timezone,
    })

  if (upsertError) {
    return NextResponse.json({ error: 'Database update failed', details: upsertError }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
