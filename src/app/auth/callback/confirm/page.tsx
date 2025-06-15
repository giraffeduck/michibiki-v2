// src/app/auth/callback/confirm/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ConfirmLogin() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          console.error('Error setting session:', error)
          router.push('/login-error?error=session_set_failed')
        } else {
          router.push('/dashboard')
        }
      })
    } else {
      router.push('/login-error?error=missing_tokens')
    }
  }, [params, router, supabase])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-700">ログイン処理中です...</p>
    </div>
  )
}
