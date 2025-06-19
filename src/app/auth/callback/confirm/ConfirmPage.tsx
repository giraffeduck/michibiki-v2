// src/app/auth/callback/confirm/ConfirmPage.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    // 🔍 デバッグ用ログ：現在の URL とクエリ内容を確認
    console.log('[ConfirmPage init] full URL:', window.location.href)
    console.log('[ConfirmPage init] searchParams:', Object.fromEntries(searchParams.entries()))

    const login = async () => {
      const email = searchParams.get('email')
      const userId = searchParams.get('user_id')

      console.log('[ConfirmPage login] email:', email)
      console.log('[ConfirmPage login] user_id:', userId)

      if (!email || !userId) {
        console.error('email or user_id is missing in query params')
        router.push('/login-error?error=missing_email_or_password')
        return
      }

      const stravaIdMatch = email.match(/^strava_(\d+)@strava\.local$/)
      if (!stravaIdMatch) {
        console.error('email format is invalid:', email)
        router.push('/login-error?error=invalid_email_format')
        return
      }

      const password = `strava_${stravaIdMatch[1]}_dummy_password`
      console.log('[ConfirmPage login] attempting signInWithPassword with', { email, password })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('[ConfirmPage signInWithPassword] data:', data)
      console.log('[ConfirmPage signInWithPassword] error:', error)

      if (error) {
        console.error('Supabase login failed:', error)
        router.push('/login-error?error=supabase_login_failed')
      } else {
        router.push('/dashboard')
      }
    }

    login()
  }, [searchParams, router, supabase])

  return <p>ログイン処理中です…</p>
}
