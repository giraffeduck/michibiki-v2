// src/app/api/user/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

type UpdateFields = Partial<{
  week_start_day: string
  timezone: string
  gender: string
  birth_date: string
  email: string
  weight_kg: number
  ftp: number
  run_5k_time: string
  swim_400m_time: string
}>

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

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

  if (authError || !user) {
    console.error('[settings API] Auth error:', authError)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updateFields: UpdateFields = {
    week_start_day,
    timezone,
    gender,
    birth_date,
    email,
    weight_kg,
    ftp,
    run_5k_time,
    swim_400m_time,
  }

  Object.keys(updateFields).forEach((key) => {
    const value = updateFields[key as keyof UpdateFields]
    if (value === undefined || value === '') {
      delete updateFields[key as keyof UpdateFields]
    }
  })

  const { error: updateError } = await supabase
    .from('users')
    .update(updateFields)
    .eq('id', user.id)

  if (updateError) {
    console.error('[settings API] update error:', updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Settings updated' }, { status: 200 })
}
