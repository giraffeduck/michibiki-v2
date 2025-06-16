// src/app/dashboard/activities/page.tsx
import { Suspense } from 'react'
import { ActivityListWrapper } from '@/components/dashboard/ActivityListWrapper'

export default function ActivitiesPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">週別トレーニング一覧</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <ActivityListWrapper />
      </Suspense>
    </div>
  )
}
