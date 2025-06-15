// src/app/onboarding/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function OnboardingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id')

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!userId) {
      setError('ユーザー情報が見つかりません。')
      setLoading(false)
      return
    }

    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, email }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'エラーが発生しました。')
      setLoading(false)
      return
    }

    // 成功時は /dashboard に遷移
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">メールアドレスの登録</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {loading ? '送信中...' : '登録して続ける'}
        </button>
      </form>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">読み込み中...</div>}>
      <OnboardingForm />
    </Suspense>
  )
}
