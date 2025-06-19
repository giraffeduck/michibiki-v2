// src/app/onboarding/step1/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingStep1() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id') // ← URLから user_id を取得

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSendEmail = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, user_id: userId })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || '確認メールを送信しました。メールをご確認ください。')
      } else {
        setError(data.error || 'メール送信に失敗しました。')
      }
    } catch (err) {
      console.error(err)
      setError('サーバーとの通信に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">メールアドレスを登録してください</h1>

      <label className="block mb-6">
        メールアドレス:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="your@email.com"
          required
        />
      </label>

      <button
        onClick={handleSendEmail}
        disabled={loading || !email || !userId}
        className="bg-[#009F9D] text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? '送信中…' : '確認メールを送信'}
      </button>

      {message && (
        <p className="mt-4 text-green-600 font-medium">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-medium">{error}</p>
      )}
    </main>
  )
}
