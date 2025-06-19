// src/app/auth/callback/confirm/page.tsx
import { Suspense } from 'react'
import { ClientWrapper } from './ClientWrapper'

export default function ConfirmPageWrapper() {
  return (
    <Suspense fallback={<div>ログイン処理中...</div>}>
      <ClientWrapper />
    </Suspense>
  )
}
