// src/app/api/goals/route.ts
import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';
import { withAuth } from '@/templates/api-auth-wrapper';

// Supabaseクライアント初期化
const supabase = createRouteHandlerClient<Database>({ cookies });

export const GET = withAuth(async (user) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('race_date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
});

export const POST = withAuth(async (user, request) => {
  const body = await request.json();

  const {
    race_name,
    race_date,
    priority,
    total_target_time,
    swim_distance_m,
    swim_target_time,
    bike_distance_km,
    bike_target_time,
    run_distance_km,
    run_target_time,
  } = body;

  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        user_id: user.id,
        race_name,
        race_date,
        priority,
        total_target_time,
        swim_distance_m,
        swim_target_time,
        bike_distance_km,
        bike_target_time,
        run_distance_km,
        run_target_time,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
});
