// src/app/auth/callback/confirm/ConfirmPage.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id') || ''
  const email = searchParams.get('email') || ''
  const stravaId = searchParams.get('strava_id') || ''

  useEffect(() => {
    if (userId && email && stravaId) {
      const params = new URLSearchParams({
        user_id: userId,
        email,
        strava_id: stravaId,
      }).toString()
      router.replace(`/onboarding/step1?${params}`)
    }
  }, [router, userId, email, stravaId])

  return (
    <main className="p-8 max-w-xl mx-auto">
      <div className="text-lg text-center py-12">
        ログイン処理中です。<br />
        しばらくお待ちください...
      </div>
    </main>
  )
}
