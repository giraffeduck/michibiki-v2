'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const email = searchParams.get('email')
    const userId = searchParams.get('user_id')
    console.log('[ConfirmPage] email:', email)
    console.log('[ConfirmPage] user_id:', userId)

    if (!email || !userId) {
      console.error('email or user_id is missing in query params')
      router.push('/login-error?error=missing_email_or_user_id')
      return
    }

    const stravaIdMatch = email.match(/^strava_(\d+)@strava\.local$/)
    if (!stravaIdMatch) {
      console.error('email format is invalid:', email)
      router.push('/login-error?error=invalid_email_format')
      return
    }

    // ✅ クエリ付きで遷移する（ここが重要）
    router.push(`/onboarding/step1?user_id=${userId}`)
  }, [searchParams, router])

  return <p>ログインを完了しています。しばらくお待ちください...</p>
}
