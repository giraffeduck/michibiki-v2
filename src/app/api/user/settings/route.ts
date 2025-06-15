// src/app/api/user/settings/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  })

  const payload = await req.json()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: 'Authentication failed', details: userError }),
      { status: 401 }
    )
  }

  const { weight_kg, ftp, run_5k_time, swim_400m_time } = payload

  const { error } = await supabase
    .from('users')
    .update({ weight_kg, ftp, run_5k_time, swim_400m_time })
    .eq('id', user.id)

  if (error) {
    return new Response(JSON.stringify({ error: 'Database update failed', details: error }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ message: 'Settings updated' }), {
    status: 200,
  })
}
