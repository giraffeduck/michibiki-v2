'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    // クライアントの Cookie から直接 user_id を参照（バリデーションなど必要なら追加）
    const userId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user_id='))
      ?.split('=')[1]

    if (userId) {
      router.push('/dashboard')
    }
  }, [router])

  return <p>ログインを完了しています。しばらくお待ちください...</p>
}
