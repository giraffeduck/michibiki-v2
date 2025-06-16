// src/app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login-error?error=missing_code', req.url))
  }

  const tokenResponse = await fetch('https://www.strava.com/api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })

  const tokenData = await tokenResponse.json()
  console.log('[Strava tokenData]', tokenData)

  if (!tokenData.access_token || !tokenData.athlete) {
    return NextResponse.redirect(new URL('/login-error?error=invalid_token', req.url))
  }

  const athlete = tokenData.athlete
  const stravaId = athlete.id
  const email = `strava_${stravaId}@strava.local`
  const password = `strava_${stravaId}_dummy_password`

  let userId: string | null = null

  const { data: existingConnection } = await supabaseAdmin
    .from('external_connections')
    .select('user_id')
    .eq('provider', 'strava')
    .eq('credentials->athlete->id', stravaId)
    .maybeSingle()

  if (existingConnection) {
    userId = existingConnection.user_id

    const { data: userInAuth } = await supabaseAdmin.auth.admin.getUserById(userId!)
    if (!userInAuth?.user?.id || userInAuth.user.id !== userId) {
      const { data: recreatedUser, error: recreateError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
      })

      if (recreateError?.status === 422 && recreateError.message?.includes('already been registered')) {
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers()
        const foundByEmail = userList?.users.find((u) => u.email === email)
        if (foundByEmail) {
          userId = foundByEmail.id
        } else {
          console.error('Email exists but user not found in listUsers()')
          return NextResponse.redirect(new URL('/login-error?error=email_exists_but_user_not_found', req.url))
        }
      } else if (recreateError) {
        console.error('Failed to recreate auth user:', recreateError)
        return NextResponse.redirect(new URL('/login-error?error=auth_user_recreate_failed', req.url))
      } else {
        userId = recreatedUser.user.id
      }

      const { error: updateConnectionError } = await supabaseAdmin
        .from('external_connections')
        .update({ user_id: userId })
        .eq('provider', 'strava')
        .eq('credentials->athlete->id', stravaId)

      if (updateConnectionError) {
        console.error('Failed to update external_connections user_id:', updateConnectionError)
        return NextResponse.redirect(new URL('/login-error?error=external_user_id_update_failed', req.url))
      }
    }

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (!existingUser) {
      const { error: userUpsertError } = await supabaseAdmin.from('users').upsert({
        id: userId,
        name: `${athlete.firstname} ${athlete.lastname}`,
        gender: athlete.sex === 'M' ? 'Male' : athlete.sex === 'F' ? 'Female' : 'Other',
        weight_kg: athlete.weight,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        plan: 'free',
      }, {
        onConflict: 'id',
      })

      if (userUpsertError) {
        console.error('User upsert failed:', userUpsertError)
        return NextResponse.redirect(new URL('/login-error?error=user_upsert_failed', req.url))
      }
    }

  } else {
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers()
    const found = userList?.users.find((u) => u.email === email)

    if (found) {
      userId = found.id
    } else {
      const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
      })

      if (createError) {
        console.error('Auth user creation failed:', createError)
        return NextResponse.redirect(new URL('/login-error?error=auth_create_failed', req.url))
      }

      userId = createdUser?.user?.id ?? null
    }

    if (!userId) {
      return NextResponse.redirect(new URL('/login-error?error=no_user_id', req.url))
    }

    const { error: insertError } = await supabaseAdmin.from('external_connections').upsert({
      user_id: userId,
      provider: 'strava',
      credentials: tokenData,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,provider',
    })

    if (insertError) {
      console.error('External connection insert failed:', insertError)
      return NextResponse.redirect(new URL('/login-error?error=external_insert_failed', req.url))
    }

    const { error: userUpsertError } = await supabaseAdmin.from('users').upsert({
      id: userId,
      name: `${athlete.firstname} ${athlete.lastname}`,
      gender: athlete.sex === 'M' ? 'Male' : athlete.sex === 'F' ? 'Female' : 'Other',
      weight_kg: athlete.weight,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plan: 'free',
    }, {
      onConflict: 'id',
    })

    if (userUpsertError) {
      console.error('User upsert failed:', userUpsertError)
      return NextResponse.redirect(new URL('/login-error?error=user_upsert_failed', req.url))
    }
  }

  // 🔐 Supabase Auth にログイン（ここが今回の追加）
  const supabaseClient = createServerComponentClient<Database>({ cookies })
  const { error: loginError } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    console.error('Failed to login user to Supabase Auth:', loginError)
    return NextResponse.redirect(new URL('/login-error?error=supabase_login_failed', req.url))
  }

  // ✅ セッション確立後、ダッシュボードに遷移
  return NextResponse.redirect(new URL('/dashboard', req.url))
}
