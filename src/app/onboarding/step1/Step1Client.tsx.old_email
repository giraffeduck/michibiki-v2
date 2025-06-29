// src/app/onboarding/step1/Step1Client.tsx
'use client'

import { useEffect, useState } from 'react'

export default function Step1Client() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('user_id')
      setUserId(id)
    }
  }, [])

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
        setMessage('確認メールを送信しました')
      } else {
        setError(data.error || 'メール送信に失敗しました')
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
        <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
          <p className="font-semibold mb-2">確認メールを送信しました。</p>
          <p className="text-sm leading-relaxed">
            ご入力いただいたメールアドレス宛に、
            <strong>michibiki@resend.dev</strong> から確認用リンクをお送りしています。<br />
            メールが届かない場合は、迷惑メールフォルダやアドレスの入力ミスをご確認ください。<br />
            確認リンクをクリックすると、次のステップに進むことができます。
          </p>
        </div>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-medium">{error}</p>
      )}
    </main>
  )
}
