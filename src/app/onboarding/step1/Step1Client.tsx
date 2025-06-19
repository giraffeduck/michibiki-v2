// src/app/onboarding/step1/Step1Client.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Step1Client() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user_id = searchParams.get('user_id')
    if (user_id) {
      setUserId(user_id)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !userId) {
      alert('メールアドレスまたはユーザー情報が不足しています')
      return
    }

    setLoading(true)
    const res = await fetch('/api/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email, user_id: userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('確認メールを送信しました')
    } else {
      alert(data.error || 'エラーが発生しました')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">メールアドレスの確認</h1>
      <p className="text-sm text-gray-600 mb-4">
        サインインを完了するには、メールアドレスを入力し、確認メールを受け取ってください。
      </p>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">メールアドレス</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#009F9D] text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '送信中...' : '確認メールを送信'}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
          <p className="font-semibold mb-2">確認メールを送信しました。</p>
          <p className="text-sm leading-relaxed">
            ご入力いただいたメールアドレス宛に確認用リンクをお送りしています。<br />
            メールが届かない場合は、迷惑メールフォルダやアドレスの入力ミスをご確認ください。<br />
            確認リンクをクリックすると、次のステップに進むことができます。
          </p>
        </div>
      )}
    </div>
  )
}
