// src/app/onboarding/page.tsx
import { redirect } from 'next/navigation'

export default function OnboardingIndexPage() {
  redirect('/onboarding/step1')
}
