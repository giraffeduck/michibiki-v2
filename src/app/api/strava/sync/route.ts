// src/app/api/strava/sync/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = request.headers.get('cookie');
          const match = cookie
            ?.split(';')
            ?.find((c) => c.trim().startsWith(`${name}=`));
          return match ? decodeURIComponent(match.split('=')[1]) : undefined;
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: connections, error: connError } = await supabase
    .from('external_connections')
    .select('credentials')
    .eq('user_id', user.id)
    .eq('provider', 'strava')
    .single();

  if (connError || !connections) {
    return NextResponse.json(
      { error: 'Strava connection not found' },
      { status: 404 }
    );
  }

  const credentials = connections.credentials as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };

  const now = Math.floor(Date.now() / 1000);
  if (credentials.expires_at < now) {
    return NextResponse.json(
      { error: 'Strava token expired (refresh not implemented yet)' },
      { status: 401 }
    );
  }

  const stravaRes = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=50`,
    {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
    }
  );

  if (!stravaRes.ok) {
    const errorText = await stravaRes.text();
    return NextResponse.json(
      { error: 'Strava API error', details: errorText },
      { status: 500 }
    );
  }

  const activities = (await stravaRes.json()) as any[];

  let insertedCount = 0;

  for (const act of activities) {
    const { error: insertError } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        external_id: act.id.toString(),
        provider: 'strava',
        name: act.name,
        type: act.type,
        start_date: act.start_date,
        distance_m: act.distance,
        duration_s: act.elapsed_time,
        total_elevation_gain_m: act.total_elevation_gain,
        average_heartrate: act.average_heartrate,
        max_heartrate: act.max_heartrate,
        average_watts: act.average_watts,
        average_cadence: act.average_cadence,
        raw_data: act,
      })
      .select();

    // 重複エラー（ユニーク制約違反）は無視
    if (insertError) {
      if (insertError.code === '23505') {
        continue;
      } else {
        return NextResponse.json(
          { error: 'Database insert error', details: insertError.message },
          { status: 500 }
        );
      }
    }

    insertedCount++;
  }

  return NextResponse.json({
    message: 'Sync completed',
    inserted: insertedCount,
  });
}
