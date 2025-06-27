// src/app/onboarding/step1/Step1Client.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/ssr'

export default function Step1Client() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id') || ''
  const emailParam = searchParams.get('email') || ''
  const stravaId = searchParams.get('strava_id') || ''
  const email = stravaId ? `strava_${stravaId}@example.com` : emailParam
  const password = stravaId ? `strava_${stravaId}_dummy_password` : ''

  const [weekStartDay, setWeekStartDay] = useState('Monday')
  const [timezone, setTimezone] = useState('Asia/Tokyo')
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [userError, setUserError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const doSignIn = async () => {
      if (!email || !stravaId) {
        setUserError('認証情報が取得できません。')
        return
      }
      setSigningIn(true)
      setUserError(null)
      try {
        // createClientでSupabaseインスタンスを作成
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setUserError('認証エラー: ' + error.message)
        }
      } catch {
        setUserError('認証処理に失敗しました')
      } finally {
        setSigningIn(false)
      }
    }
    doSignIn()
  }, [email, stravaId, password])

  const isValid = weekStartDay && timezone && userId && !signingIn

  const handleNext = () => {
    if (!isValid) return
    const query = new URLSearchParams({
      user_id: userId,
      week_start_day: weekStartDay,
      timezone,
      gender,
      birth_date: birthDate,
      email,
      strava_id: stravaId,
    }).toString()
    router.push(`/onboarding/step2?${query}`)
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ようこそ！まずは基本情報を入力してください。</h1>

      {userError && <div className="text-red-500 mb-4">{userError}</div>}
      {signingIn && (
        <div className="mb-4 text-gray-600">認証中です… 少々お待ちください。</div>
      )}

      <label className="block mb-4">
        週の開始曜日 <span className="text-red-500">*</span>：
        <div className="mt-1">
          <label className="mr-4">
            <input
              type="radio"
              name="weekStartDay"
              value="Monday"
              checked={weekStartDay === 'Monday'}
              onChange={() => setWeekStartDay('Monday')}
              disabled={signingIn}
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
              disabled={signingIn}
            />
            日曜日
          </label>
        </div>
      </label>

      <label className="block mb-4">
        タイムゾーン <span className="text-red-500">*</span>：
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          disabled={signingIn}
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
          disabled={signingIn}
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
          disabled={signingIn}
        />
      </label>

      <button
        onClick={handleNext}
        disabled={!isValid}
        className={`bg-[#009F9D] text-white px-4 py-2 rounded hover:opacity-90 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        次へ
      </button>
    </main>
  )
}
