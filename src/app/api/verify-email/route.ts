// src/app/api/verify-email/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/error?reason=missing-token`, { status: 302 })
  }

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!) as {
      email: string
      strava_id: number
    }

    const { email, strava_id } = decoded

    // 該当ユーザーを更新
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email,
        email_verified: true
      })
      .eq('strava_id', strava_id)

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/error?reason=db`, { status: 302 })
    }

    // 成功時：step2へ
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/step2`, { status: 302 })

  } catch (err) {
    console.error('JWT decode error:', err)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/error?reason=invalid-token`, { status: 302 })
  }
}
