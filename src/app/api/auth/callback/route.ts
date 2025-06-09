// src/app/api/auth/callback/route.ts
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // サーバー専用キー
)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login-error?error=missing_code', req.url))
  }

  // Strava トークン取得
  const tokenRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })

  const tokenData = await tokenRes.json()

  if (!tokenData.access_token || !tokenData.athlete) {
    return NextResponse.redirect(new URL('/login-error?error=token_failed', req.url))
  }

  const athlete = tokenData.athlete
  const stravaId = athlete.id
  const email = `strava_${stravaId}@strava.local`
  const password = `strava_${randomUUID()}` // 一時的な仮パスワード

  // 既存ユーザーのチェック
  const { data: existingUser, error: findError } = await supabaseAdmin
    .from('external_connections')
    .select('user_id')
    .eq('provider', 'strava')
    .eq('credentials->athlete->id', stravaId)
    .maybeSingle()

  let userId: string | null = null

  // 新規ユーザーの場合のみ作成
  if (!existingUser) {
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        strava_id: stravaId,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        profile: athlete.profile,
      },
    })

    if (createError || !createdUser?.user?.id) {
      return NextResponse.redirect(new URL('/login-error?error=user_create_failed', req.url))
    }

    userId = createdUser.user.id

    // Supabaseログイン（新規ユーザーに対してのみ）
    const { data: sessionData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !sessionData.session?.access_token) {
      return NextResponse.redirect(new URL('/login-error?error=auth_failed', req.url))
    }

    // external_connections に保存
    await supabaseAdmin.from('external_connections').upsert({
      user_id: userId,
      provider: 'strava',
      credentials: tokenData,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,provider',
    })

    // Cookie にアクセストークンを保存
    const response = NextResponse.redirect(new URL('/dashboard', req.url))
    response.headers.set(
      'Set-Cookie',
      `supabase-auth-token=${sessionData.session.access_token}; Path=/; Max-Age=7200; HttpOnly; SameSite=Lax${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    )
    return response
  } else {
    // 既存ユーザーはログインさせずにエラー画面へ
    return NextResponse.redirect(new URL('/login-error?error=already_exists', req.url))
  }
}
