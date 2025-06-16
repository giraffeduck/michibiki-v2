// src/components/dashboard/ActivityListWrapper.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { ActivityList } from './ActivityList'
import { getCurrentISOWeek } from '@/utils/dateHelpers'

export function ActivityListWrapper() {
  const searchParams = useSearchParams()
  const week = searchParams.get('week') || getCurrentISOWeek()

  return <ActivityList isoWeek={week} />
}
