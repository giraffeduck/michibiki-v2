// src/components/dashboard/ActivityList.tsx
'use client'

import { useEffect, useState } from 'react'

type Activity = {
  id: number
  name: string | null
  type: string | null
  start_date: string
  distance_m: number | null
  duration_s: number | null
  average_heartrate: number | null
  average_watts: number | null
}

export function ActivityList({ isoWeek }: { isoWeek: string }) {
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/activities/week?week=${isoWeek}`, {
          credentials: 'include',
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || '不明なエラー')
        setActivities(json.data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
      }
    }
    fetchData()
  }, [isoWeek])

  if (error) return <p className="text-red-500">エラー: {error}</p>
  if (!activities) return <p>読み込み中...</p>
  if (activities.length === 0) return <p>この週のアクティビティはありません。</p>

  return (
    <table className="w-full text-sm border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">種目</th>
          <th className="border px-2 py-1">タイトル</th>
          <th className="border px-2 py-1">日付</th>
          <th className="border px-2 py-1">距離 (km)</th>
          <th className="border px-2 py-1">時間</th>
          <th className="border px-2 py-1">パワー (W)</th>
          <th className="border px-2 py-1">心拍 (bpm)</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((a) => (
          <tr key={a.id}>
            <td className="border px-2 py-1">{a.type || '-'}</td>
            <td className="border px-2 py-1">{a.name || '-'}</td>
            <td className="border px-2 py-1">{new Date(a.start_date).toLocaleString()}</td>
            <td className="border px-2 py-1">{a.distance_m ? (a.distance_m / 1000).toFixed(1) : '-'}</td>
            <td className="border px-2 py-1">{formatDuration(a.duration_s)}</td>
            <td className="border px-2 py-1">{a.average_watts?.toFixed(0) || '-'}</td>
            <td className="border px-2 py-1">{a.average_heartrate?.toFixed(0) || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function formatDuration(sec: number | null | undefined): string {
  if (!sec) return '-'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}
