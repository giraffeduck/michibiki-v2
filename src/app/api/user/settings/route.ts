// src/app/api/user/settings/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

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
    return new Response(
      JSON.stringify({ error: 'Authentication failed', details: userError }),
      { status: 401 }
    )
  }

  const { error } = await supabase.from('users').upsert(
    {
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
    },
    { onConflict: 'id' }
  )

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
