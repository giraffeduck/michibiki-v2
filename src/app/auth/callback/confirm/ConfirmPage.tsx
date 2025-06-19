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
    const login = async () => {
      const email = searchParams.get('email')

      if (!email) {
        console.error('email is missing in query params')
        router.push('/login-error?error=missing_email')
        return
      }

      const stravaIdMatch = email.match(/^strava_(\d+)@strava\.local$/)
      if (!stravaIdMatch) {
        console.error('email format is invalid')
        router.push('/login-error?error=invalid_email_format')
        return
      }

      const password = `strava_${stravaIdMatch[1]}_dummy_password`

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

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
