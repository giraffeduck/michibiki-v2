// src/utils/dateHelpers.ts
import { getISOWeek, getISOWeekYear } from 'date-fns'

/**
 * 現在の日付から ISO週（例: '2025-W24'）を返す
 */
export function getCurrentISOWeek(): string {
  const now = new Date()
  const week = getISOWeek(now)
  const year = getISOWeekYear(now)
  return `${year}-W${String(week).padStart(2, '0')}`
}
