'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Step2Form() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [weightKg, setWeightKg] = useState('')
  const [ftp, setFtp] = useState('')
  const [run5kTime, setRun5kTime] = useState('')
  const [swim400mTime, setSwim400mTime] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const params = {
      week_start_day: searchParams.get('week_start_day'),
      timezone: searchParams.get('timezone'),
      gender: searchParams.get('gender'),
      birth_date: searchParams.get('birth_date'),
      email: searchParams.get('email'),
      weight_kg: parseFloat(weightKg),
      ftp: ftp ? parseInt(ftp) : undefined,
      run_5k_time: run5kTime ? `00:${run5kTime}` : undefined,
      swim_400m_time: swim400mTime ? `00:${swim400mTime}` : undefined,
    }

    const res = await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      console.error('API error:', await res.text())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <p className="text-sm text-gray-600">
        あなたのトレーニングに関する基本情報を入力してください。
        <br />
        ※「体重」は入力必須。他は任意項目です。
      </p>

      <div>
        <Label htmlFor="weightKg">体重（kg）※必須</Label>
        <Input
          id="weightKg"
          type="number"
          required
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="ftp">FTP（任意）</Label>
        <Input
          id="ftp"
          type="number"
          value={ftp}
          onChange={(e) => setFtp(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="run5kTime">5kmランベスト（任意, mm:ss）</Label>
        <Input
          id="run5kTime"
          placeholder="20:00"
          value={run5kTime}
          onChange={(e) => setRun5kTime(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="swim400mTime">400mスイムベスト（任意, mm:ss）</Label>
        <Input
          id="swim400mTime"
          placeholder="08:00"
          value={swim400mTime}
          onChange={(e) => setSwim400mTime(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#009F9D] text-white hover:bg-[#007B7A]"
      >
        入力完了してMichibikiを使用
      </Button>
    </form>
  )
}
