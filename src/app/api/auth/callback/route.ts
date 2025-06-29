// src/app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login-error?error=missing_code', req.url));
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
  });

  const tokenData = await tokenResponse.json();
  console.log('[Strava tokenData]', tokenData);

  if (!tokenData.access_token || !tokenData.athlete) {
    return NextResponse.redirect(new URL('/login-error?error=invalid_token', req.url));
  }

  const athlete = tokenData.athlete;
  const stravaId = athlete.id;
  const email = `strava_${stravaId}@example.com`;
  const password = `strava_${stravaId}_dummy_password`;

  let userId: string | null = null;

  const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
  const found = userList?.users.find((u) => u.email === email);

  if (found) {
    userId = found.id;
  } else {
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error('Auth user creation failed:', {
        message: createError.message,
        status: createError.status,
      });
      return NextResponse.redirect(new URL('/login-error?error=auth_create_failed', req.url));
    }

    userId = createdUser?.user?.id ?? null;
  }

  if (!userId) {
    return NextResponse.redirect(new URL('/login-error?error=no_user_id', req.url));
  }

  const { error: insertError } = await supabaseAdmin.from('external_connections').upsert(
    {
      user_id: userId,
      provider: 'strava',
      credentials: tokenData,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,provider',
    }
  );

  if (insertError) {
    console.error('External connection insert failed:', insertError);
    return NextResponse.redirect(new URL('/login-error?error=external_insert_failed', req.url));
  }

  const { error: userUpsertError } = await supabaseAdmin.from('users').upsert(
    {
      id: userId,
      name: `${athlete.firstname} ${athlete.lastname}`,
      gender: athlete.sex === 'M' ? 'Male' : athlete.sex === 'F' ? 'Female' : 'Other',
      weight_kg: athlete.weight,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plan: 'free',
    },
    {
      onConflict: 'id',
    }
  );

  if (userUpsertError) {
    console.error('User upsert failed:', userUpsertError);
    return NextResponse.redirect(new URL('/login-error?error=user_upsert_failed', req.url));
  }

  // onboarding_completed を確認して分岐
  const { data: userRecord, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('onboarding_completed')
    .eq('id', userId)
    .single();

  if (fetchError) {
    console.error('User fetch failed:', fetchError);
  }

  let redirectPath = '/onboarding';
  if (userRecord && userRecord.onboarding_completed) {
    redirectPath = '/dashboard';
  }

  return NextResponse.redirect(new URL(redirectPath, req.url));
}
