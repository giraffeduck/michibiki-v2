// src/app/api/planning/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { weeklyHours, swimPct, bikePct, runPct } = body;

    // TODO: 認証・Aレース取得処理を後で実装

    // モックAレース日（6か月後）
    const raceDate = new Date();
    raceDate.setMonth(raceDate.getMonth() + 6);

    // 今日からAレースまでの週数
    const now = new Date();
    const diffTime = raceDate.getTime() - now.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    // シンプル期分けルール
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

    // 計画JSON
    const plan = {
      startDate: now.toISOString(),
      raceDate: raceDate.toISOString(),
      weeksTotal: diffWeeks,
      phases: {
        base,
        build,
        peak,
        taper,
      },
      weeklyHours,
      disciplineRatio: {
        swim: swimPct,
        bike: bikePct,
        run: runPct,
      },
    };

    return NextResponse.json(plan);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
