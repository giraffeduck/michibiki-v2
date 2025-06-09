// src/app/login-error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function LoginErrorPage() {
  const params = useSearchParams()
  const error = params.get('error') ?? 'unknown'

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">ログインに失敗しました</h1>
      <p className="mt-4 text-red-500 font-mono">エラーコード: {error}</p>
      <p className="mt-6">再度お試しいただくか、管理者にご連絡ください。</p>
      <a href="/" className="mt-4 inline-block text-blue-600 underline">トップページに戻る</a>
    </div>
  )
}
