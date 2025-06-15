// src/app/onboarding/step2/page.tsx
'use client'

import { Suspense } from 'react'
import { Step2Form } from './Step2Form'

export default function Step2Page() {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">ステップ2：トレーニング項目の入力</h1>
      <p className="mb-4 text-sm text-gray-600">
        あなたのトレーニングに関する基本情報を入力してください。<br />
        ※「体重」は入力必須。他は任意項目です。
      </p>
      <Suspense fallback={<div>読み込み中...</div>}>
        <Step2Form />
      </Suspense>
    </div>
  )
}
