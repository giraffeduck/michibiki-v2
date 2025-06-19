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
      const userId = searchParams.get('user_id')

      if (!userId) {
        console.error('user_id is missing in query params')
        router.push('/login-error?error=missing_user_id')
        return
      }

      const email = `strava_${userId}@strava.local`
      const password = `strava_${userId}_dummy_password`

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
