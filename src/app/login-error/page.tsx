// src/app/login-error/page.tsx
'use client'

import Link from 'next/link'

export default function LoginErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600 mb-4">ログインエラー</h1>
      <p className="mb-2">Stravaログイン中にエラーが発生しました。</p>
      <Link href="/">
        <span className="text-blue-500 underline">トップページに戻る</span>
      </Link>
    </div>
  )
}
