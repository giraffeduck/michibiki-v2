// src/app/onboarding/step2/Step2Form.tsx

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Step2Form() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [weight, setWeight] = useState('')
  const [ftp, setFtp] = useState('')
  const [run5k, setRun5k] = useState('')
  const [swim400m, setSwim400m] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      week_start_day: searchParams.get('week_start_day'),
      timezone: searchParams.get('timezone'),
      gender: searchParams.get('gender') || null,
      birth_date: searchParams.get('birth_date') || null,
      email: searchParams.get('email') || null,
      weight_kg: weight ? Number(weight) : null,
      ftp: ftp ? Number(ftp) : null,
      run_5k_time: run5k ? `00:${run5k}` : null,
      swim_400m_time: swim400m ? `00:${swim400m}` : null,
    }

    const response = await fetch('/api/user/settings', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      router.push('/dashboard')
    } else {
      console.error('Failed to submit user settings')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-bold">トレーニング情報を入力してください</h1>
      <p className="text-sm text-muted-foreground">
        あなたのトレーニングに関する基本情報を入力してください。<br />
        ※「体重」は入力必須。他は任意項目です。
      </p>

      <div>
        <Label htmlFor="weight">体重（kg）<span className="text-red-500">*</span></Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          required
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="ftp">FTP（W）</Label>
        <Input
          id="ftp"
          type="number"
          value={ftp}
          onChange={(e) => setFtp(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="run5k">5kmランベストタイム（MM:SS）</Label>
        <Input
          id="run5k"
          placeholder="20:00"
          pattern="[0-5][0-9]:[0-5][0-9]"
          value={run5k}
          onChange={(e) => setRun5k(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="swim400m">400mスイムベストタイム（MM:SS）</Label>
        <Input
          id="swim400m"
          placeholder="06:30"
          pattern="[0-5][0-9]:[0-5][0-9]"
          value={swim400m}
          onChange={(e) => setSwim400m(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : '完了'}
      </Button>
    </form>
  )
}
