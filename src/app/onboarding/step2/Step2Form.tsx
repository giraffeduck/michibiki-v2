// src/app/onboarding/step2/Step2Form.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Step2Form() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const weekStartDay = searchParams.get('week_start_day') || ''
  const timezone = searchParams.get('timezone') || ''
  const gender = searchParams.get('gender') || ''
  const birthDate = searchParams.get('birth_date') || ''
  const email = searchParams.get('email') || ''

  const [weight, setWeight] = useState('')
  const [ftp, setFtp] = useState('')
  const [run5k, setRun5k] = useState('')
  const [swim400m, setSwim400m] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 必須: 体重のみ
  const isValid = weight.trim() !== '' && !isNaN(Number(weight))

  const handleSubmit = async () => {
    if (!isValid || loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_start_day: weekStartDay,
          timezone,
          gender,
          birth_date: birthDate,
          email,
          weight_kg: Number(weight),
          ftp: ftp ? Number(ftp) : null,
          run_5k_time: run5k,
          swim_400m_time: swim400m,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'サーバーエラーが発生しました')
      }

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('エラーが発生しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">トレーニング指標の入力</h1>

      <label className="block mb-4">
        体重 (kg) <span className="text-red-500">*</span>:
        <input
          type="number"
          min="30"
          max="150"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </label>

      <label className="block mb-4">
        FTP (W)（任意）:
        <input
          type="number"
          min="100"
          max="500"
          value={ftp}
          onChange={(e) => setFtp(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-4">
        5kmランベスト（任意）:
        <input
          type="text"
          value={run5k}
          onChange={(e) => setRun5k(e.target.value)}
          placeholder="例: 00:20:00"
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-6">
        400mスイムベスト（任意）:
        <input
          type="text"
          value={swim400m}
          onChange={(e) => setSwim400m(e.target.value)}
          placeholder="例: 00:07:30"
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        className={`bg-[#009F9D] text-white px-4 py-2 rounded hover:opacity-90 ${(!isValid || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? '送信中...' : '入力完了してMichibikiを使用'}
      </button>
    </main>
  )
}
