// src/app/auth/callback/confirm/ClientWrapper.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export function ClientWrapper() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // クライアント側はsupabase-jsから直接createClient
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]) // supabaseは不変なので依存不要

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
