// /templates/with-suspense.tsx
'use client'

import { Suspense } from 'react'

export default function WithSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
