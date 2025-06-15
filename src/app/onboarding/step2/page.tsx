// src/app/onboarding/step2/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingStep2() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const week_start_day = searchParams.get('week_start_day') || 'Monday'
  const timezone = searchParams.get('timezone') || 'Asia/Tokyo'
  const gender = searchParams.get('gender') || ''
  const birth_date = searchParams.get('birth_date') || ''
  const email = searchParams.get('email') || ''

  const [weight, setWeight] = useState('')
  const [ftp, setFtp] = useState('')
  const [run5kTime, setRun5kTime] = useState('')
  const [swim400mTime, setSwim400mTime] = useState('')

  const handleSubmit = async () => {
    if (!weight) {
      alert('体重は必須項目です。')
      return
    }

    const payload = {
      week_start_day,
      timezone,
      gender: gender || undefined,
      birth_date: birth_date || undefined,
      email: email || undefined,
      weight_kg: parseFloat(weight),
      ftp: ftp ? parseInt(ftp) : undefined,
      run_5k_time: run5kTime || undefined,
      swim_400m_time: swim400mTime || undefined,
    }

    const res = await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const { error } = await res.json()
      alert(`保存に失敗しました: ${error}`)
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">トレーニングに関する情報を入力してください。</h1>

      <label className="block mb-4">体重（kg）:
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </label>

      <label className="block mb-4">FTP（W）（任意）:
        <input
          type="number"
          value={ftp}
          onChange={(e) => setFtp(e.target.value)}
          className="w-full border rounded p-2"
        />
      </label>

      <label className="block mb-4">5kmラン ベストタイム（HH:MM:SS）（任意）:
        <input
          type="text"
          value={run5kTime}
          onChange={(e) => setRun5kTime(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="00:25:30"
        />
      </label>

      <label className="block mb-6">400mスイム ベストタイム（MM:SS）（任意）:
        <input
          type="text"
          value={swim400mTime}
          onChange={(e) => setSwim400mTime(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="08:45"
        />
      </label>

      <button
        onClick={handleSubmit}
        className="bg-[#009F9D] text-white px-4 py-2 rounded hover:opacity-90"
      >
        保存して Michibiki をはじめる
      </button>
    </main>
  )
}
