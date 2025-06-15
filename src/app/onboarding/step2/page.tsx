// src/app/onboarding/step2/page.tsx
import { Suspense } from "react"
import Step2Form from "./Step2Form"

export default function Step2Page() {
  return (
    <div className="max-w-xl mx-auto mt-12 p-4 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">STEP2：トレーニング項目</h1>
      <p className="text-sm text-gray-600 mb-6">
        あなたのトレーニングに関する基本情報を入力してください。
        <br />
        ※「体重」は入力必須。他は任意項目です。
      </p>
      <Suspense fallback={<div>読み込み中...</div>}>
        <Step2Form />
      </Suspense>
    </div>
  )
}
