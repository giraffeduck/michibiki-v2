// src/app/api/activities/week/route.ts
import { createSupabaseClientWithCookies } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getUserFromSession } from '@/templates/api-auth-wrapper'
import { startOfISOWeek, endOfISOWeek } from 'date-fns'

export async function GET(req: Request) {
  const { user, error: authError } = await getUserFromSession()
  console.log('[getUserFromSession] user:', user)
  console.log('[getUserFromSession] error:', authError)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const isoWeekParam = searchParams.get('week') // e.g., '2025-W24'

  if (!isoWeekParam) {
    return NextResponse.json({ error: 'Missing week param (e.g. ?week=2025-W24)' }, { status: 400 })
  }

  try {
    const [yearStr, weekStr] = isoWeekParam.split('-W')
    const year = parseInt(yearStr, 10)
    const week = parseInt(weekStr, 10)

    if (isNaN(year) || isNaN(week)) {
      throw new Error('Invalid ISO week format')
    }

    const refDate = new Date(year, 0, 4 + (week - 1) * 7) // ISO週の第1木曜を含む週
    const startDate = startOfISOWeek(refDate)
    const endDate = endOfISOWeek(refDate)

    // ★ ここをawait付きに修正
    const supabase = createSupabaseClientWithCookies(await cookies())

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
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('[API Error]', err)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
