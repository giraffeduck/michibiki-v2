// src/app/dashboard/activities/page.tsx
import { Suspense } from 'react'
import { ActivityList } from '@/components/dashboard/ActivityList'
import { getCurrentISOWeek } from '@/utils/dateHelpers'

export default async function ActivitiesPage(props: any) {
  const weekParam = props?.searchParams?.week || getCurrentISOWeek()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">週別トレーニング一覧（{weekParam}）</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <ActivityList isoWeek={weekParam} />
      </Suspense>
    </div>
  )
}
