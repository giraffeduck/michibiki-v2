// src/app/api/goals/[id]/route.ts
import { createSupabaseClientWithCookies } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/templates/api-auth-wrapper';

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop() || '';

  const { user, error: authError } = await getUserFromSession();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseClientWithCookies(await cookies());
  const body = await request.json();

  const { data, error } = await supabase
    .from('goals')
    .update({
      race_name: body.race_name,
      race_date: body.race_date,
      priority: body.priority,
      total_target_time: body.total_target_time,
      swim_distance_m: body.swim_distance_m,
      swim_target_time: body.swim_target_time,
      bike_distance_km: body.bike_distance_km,
      bike_target_time: body.bike_target_time,
      run_distance_km: body.run_distance_km,
      run_target_time: body.run_target_time,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop() || '';

  const { user, error: authError } = await getUserFromSession();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseClientWithCookies(await cookies());

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
