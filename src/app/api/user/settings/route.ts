// src/app/api/user/settings/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserIdFromCookie } from '@/templates/api-auth-wrapper'

export async function POST(req: Request) {
  const userId = await getUserIdFromCookie()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('users').update({
    week_start_day: body.week_start_day,
    timezone: body.timezone,
    gender: body.gender || null,
    birth_date: body.birth_date || null,
    email: body.email || null,
    weight_kg: body.weight_kg,
    ftp: body.ftp || null,
    run_5k_time: body.run_5k_time || null,
    swim_400m_time: body.swim_400m_time || null,
    updated_at: new Date().toISOString(),
  }).eq('id', userId)

  if (error) {
    console.error('User update error:', error)
    return NextResponse.json({ error: 'Failed to update user settings' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
