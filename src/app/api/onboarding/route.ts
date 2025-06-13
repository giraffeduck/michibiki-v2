// src/app/api/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { user_id, email } = await req.json()

  if (!user_id || !email) {
    return NextResponse.json({ error: 'Missing user_id or email' }, { status: 400 })
  }

  const { error } = await supabase
    .from('users')
    .update({
      email,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user_id)

  if (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Email saved' }, { status: 200 })
}
