// src/app/auth/callback/confirm/page.tsx
import { Suspense } from 'react'
import ConfirmPage from './ConfirmPage'

export default function ConfirmPageWrapper() {
  console.log('[ConfirmPageWrapper] mounted')
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPage />
    </Suspense>
  )
}
