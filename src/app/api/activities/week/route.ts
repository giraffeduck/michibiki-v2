// src/app/api/activities/week/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getUserFromSession } from '@/templates/api-auth-wrapper'
import { startOfISOWeek, endOfISOWeek } from 'date-fns'

export async function GET(req: Request) {
  const { user } = await getUserFromSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const isoWeekParam = searchParams.get('week') // 例: '2025-W23'

  if (!isoWeekParam) {
    return NextResponse.json({ error: 'Missing week param (e.g. ?week=2025-W23)' }, { status: 400 })
  }

  try {
    // ISO週 → 実際の期間に変換
    const [yearStr, weekStr] = isoWeekParam.split('-W')
    const year = parseInt(yearStr, 10)
    const week = parseInt(weekStr, 10)

    if (isNaN(year) || isNaN(week)) {
      throw new Error('Invalid ISO week format')
    }

    const refDate = new Date(year, 0, 4 + (week - 1) * 7) // ISO週の第1木曜を基準に
    const startDate = startOfISOWeek(refDate)
    const endDate = endOfISOWeek(refDate)

    const supabase = createClient(cookies())

    const { data, error } = await supabase
      .from('activities')
      .select(
        'id, name, type, start_date, distance_m, duration_s, average_heartrate, average_watts'
      )
      .eq('user_id', user.id)
      .gte('start_date', startDate.toISOString())
      .lte('start_date', endDate.toISOString())
      .order('start_date', { ascending: true })

    if (error) {
      console.error('[Supabase Error]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error('[API Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
