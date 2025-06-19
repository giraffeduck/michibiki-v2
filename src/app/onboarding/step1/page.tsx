// src/app/onboarding/step1/page.tsx
import { Suspense } from 'react'
import Step1Client from './Step1Client'

export default function OnboardingStep1Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Step1Client />
    </Suspense>
  )
}
