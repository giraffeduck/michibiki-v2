// src/app/dashboard/activities/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ActivityList } from '@/components/dashboard/ActivityList'
import { getCurrentISOWeek } from '@/utils/dateHelpers'

export default function ActivitiesPageWrapper() {
  const searchParams = useSearchParams()
  const week = searchParams.get('week') || getCurrentISOWeek()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">週別トレーニング一覧（{week}）</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <ActivityList isoWeek={week} />
      </Suspense>
    </div>
  )
}
