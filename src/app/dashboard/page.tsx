// src/app/dashboard/page.tsx
'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  console.log('📦 userId from cookie:', userId)

  if (!userId) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">ログイン情報が見つかりません</h1>
        <p>Stravaログイン後、もう一度アクセスしてください。</p>
      </div>
    )
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error || !user) {
    console.error('User fetch error:', error)
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">ユーザー情報が取得できませんでした</h1>
        <p>お手数ですが再ログインをお願いします。</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">こんにちは、{user.name ?? 'トライアスリート'} さん！</h1>
      <p className="mt-2">メールアドレス: {user.email ?? '(未登録)'}</p>
      <p className="mt-2">性別: {user.gender ?? '(未設定)'}</p>
      <p className="mt-2">プラン: {user.plan ?? 'free'}</p>
    </div>
  )
}
