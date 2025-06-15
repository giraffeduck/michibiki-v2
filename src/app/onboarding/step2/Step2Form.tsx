// src/app/onboarding/step2/Step2Form.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { OnboardingStep2Form } from '@/components/OnboardingStep2Form'

export function Step2Form() {
  const searchParams = useSearchParams()
  const router = useRouter()

  return (
    <OnboardingStep2Form
      week_start_day={searchParams.get('week_start_day') ?? undefined}
      timezone={searchParams.get('timezone') ?? undefined}
      gender={searchParams.get('gender') ?? undefined}
      birth_date={searchParams.get('birth_date') ?? undefined}
      email={searchParams.get('email') ?? undefined}
      router={router}
    />
  )
}
