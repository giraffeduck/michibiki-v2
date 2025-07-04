// src/app/api/planning/generate/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { weeklyHours, swimPct, bikePct, runPct } = body;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '認証情報が確認できません。' },
        { status: 401 }
      );
    }

    const raceDate = new Date();
    raceDate.setMonth(raceDate.getMonth() + 6);

    const now = new Date();
    const diffTime = raceDate.getTime() - now.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    let taper = 0;
    let peak = 0;
    let build = 0;
    let base = 0;

    if (diffWeeks >= 24) {
      taper = 3;
      peak = 3;
      build = 12;
      base = diffWeeks - (taper + peak + build);
    } else if (diffWeeks >= 16) {
      taper = 3;
      peak = 2;
      build = 8;
      base = diffWeeks - (taper + peak + build);
    } else {
      taper = 2;
      peak = 2;
      build = 4;
      base = diffWeeks - (taper + peak + build);
    }

    const { data, error } = await supabase
      .from('training_plans')
      .insert({
        user_id: user.id,
        race_date: raceDate.toISOString().slice(0, 10),
        start_date: now.toISOString().slice(0, 10),
        weeks_total: diffWeeks,
        phase_base_weeks: base,
        phase_build_weeks: build,
        phase_peak_weeks: peak,
        phase_taper_weeks: taper,
        weekly_hours: weeklyHours,
        discipline_ratio: {
          swim: swimPct,
          bike: bikePct,
          run: runPct,
        },
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Supabaseへの保存に失敗しました。' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
