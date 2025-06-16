// src/app/auth/callback/confirm/ConfirmPage.tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const userId = searchParams.get('user_id')
    if (userId) {
      document.cookie = `user_id=${userId}; Path=/; Max-Age=7200;`
      router.push('/dashboard')
    }
  }, [searchParams, router])

  return <p>ログインを完了しています。しばらくお待ちください...</p>
}
