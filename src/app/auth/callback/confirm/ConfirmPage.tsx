// src/app/auth/callback/confirm/ConfirmPage.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    console.log('[ConfirmPage init] full URL:', window.location.href)
    console.log('[ConfirmPage init] searchParams:', Object.fromEntries(searchParams.entries()))

    const redirect = async () => {
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

      // ✅ Supabase Authのログイン処理は不要
      // Stravaログインが済んでいるのでそのまま次へ進む
      router.push('/onboarding/step1')
    }

    redirect()
  }, [searchParams, router])

  return <p>ログインを完了しています。しばらくお待ちください...</p>
}
