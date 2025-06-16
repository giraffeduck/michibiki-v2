// src/app/dashboard/activities/page.tsx
import { Suspense } from 'react'
import { ActivityList } from '@/components/dashboard/ActivityList'
import { getCurrentISOWeek } from '@/utils/dateHelpers'

interface ActivitiesPageProps {
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const weekRaw = searchParams?.week
  const weekParam = Array.isArray(weekRaw) ? weekRaw[0] : weekRaw || getCurrentISOWeek()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">週別トレーニング一覧（{weekParam}）</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <ActivityList isoWeek={weekParam} />
      </Suspense>
    </div>
  )
}
