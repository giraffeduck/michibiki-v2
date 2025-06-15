// src/app/onboarding/step1/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingStep1() {
  const router = useRouter()
  const [weekStartDay, setWeekStartDay] = useState('Monday')
  const [timezone, setTimezone] = useState('Asia/Tokyo')
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')

  const handleNext = () => {
    const query = new URLSearchParams({
      week_start_day: weekStartDay,
      timezone,
      gender,
      birth_date: birthDate,
      email,
    }).toString()

    router.push(`/onboarding/step2?${query}`)
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ようこそ！まずは基本情報を入力してください。</h1>

      <label className="block mb-4">
        週の開始曜日:
        <div className="mt-1">
          <label className="mr-4">
            <input
              type="radio"
              name="weekStartDay"
              value="Monday"
              checked={weekStartDay === 'Monday'}
              onChange={() => setWeekStartDay('Monday')}
            />
            月曜日
          </label>
          <label>
            <input
              type="radio"
              name="weekStartDay"
              value="Sunday"
              checked={weekStartDay === 'Sunday'}
              onChange={() => setWeekStartDay('Sunday')}
            />
            日曜日
          </label>
        </div>
      </label>

      <label className="block mb-4">
        タイムゾーン:
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="Asia/Tokyo">Asia/Tokyo（日本）</option>
          <option value="UTC">UTC</option>
          <option value="America/Los_Angeles">アメリカ西海岸</option>
          <option value="Europe/London">ヨーロッパ（ロンドン）</option>
        </select>
      </label>

      <label className="block mb-4">
        性別（任意）:
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="Male">男性</option>
          <option value="Female">女性</option>
          <option value="Other">その他</option>
        </select>
      </label>

      <label className="block mb-4">
        生年月日（任意）:
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-6">
        メールアドレス（任意）:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <button
        onClick={handleNext}
        className="bg-[#009F9D] text-white px-4 py-2 rounded hover:opacity-90"
      >
        次へ
      </button>
    </main>
  )
}
