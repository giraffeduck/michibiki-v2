// src/app/api/user/settings/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({
    headers,
    cookies,
  })

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('[settings API] Auth error:', authError)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await req.json()
  const { gender, birth_date, email, weight_kg, ftp, run_5k_time, swim_400m_time, timezone, week_start_day } = payload

  const { error } = await supabase
    .from('users')
    .update({
      gender,
      birth_date,
      email,
      weight_kg,
      ftp,
      run_5k_time,
      swim_400m_time,
      timezone,
      week_start_day,
    })
    .eq('id', user.id)

  if (error) {
    console.error('[settings API] DB update error:', error)
    return NextResponse.json({ error: 'Failed to update user settings' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
