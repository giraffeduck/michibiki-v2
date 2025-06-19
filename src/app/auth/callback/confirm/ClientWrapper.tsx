// src/app/auth/callback/confirm/ClientWrapper.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export function ClientWrapper() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const [status, setStatus] = useState<'checking' | 'error'>('checking')

  useEffect(() => {
    const email = searchParams.get('email')
    const password = searchParams.get('password')

    if (!email || !password) {
      router.replace('/login-error?error=missing_email_or_password')
      return
    }

    const doLogin = async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error('Supabase login failed:', error)
        setStatus('error')
        router.replace('/login-error?error=supabase_login_failed')
      } else {
        router.replace('/dashboard')
      }
    }

    doLogin()
  }, [searchParams, supabase, router])

  return (
    <div className="p-4 text-center">
      {status === 'checking' ? (
        <p>ログインを完了しています。しばらくお待ちください...</p>
      ) : (
        <p>ログインに失敗しました。やり直してください。</p>
      )}
    </div>
  )
}
