// src/app/dashboard/page.tsx
'use server'

import { cookies } from 'next/headers'
import { createPagesServerClient as createAppRouterSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Supabaseクライアントを作成（App Router用の推奨方法）
  const supabase = createAppRouterSupabaseClient({ cookies })

  // Supabaseの認証情報からログイン中のユーザーを取得
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  // ユーザーが見つからなければログイン画面を表示
  if (sessionError || !user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">ログイン情報が見つかりません</h1>
        <p>Stravaログイン後、もう一度アクセスしてください。</p>
      </div>
    )
  }

  // usersテーブルから追加情報を取得
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (userError || !userData) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">ユーザー情報が取得できませんでした</h1>
        <p>お手数ですが再ログインをお願いします。</p>
      </div>
    )
  }

  // オンボーディング未完了ならリダイレクト
  if (!userData.week_start_day || !userData.weight_kg) {
    return redirect('/onboarding')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">こんにちは、{userData.name ?? 'トライアスリート'} さん！</h1>
      <p className="mt-2">メールアドレス: {userData.email ?? '(未登録)'}</p>
      <p className="mt-2">性別: {userData.gender ?? '(未設定)'}</p>
      <p className="mt-2">プラン: {userData.plan ?? 'free'}</p>
      <p className="mt-2">週の開始日: {userData.week_start_day}</p>
      <p className="mt-2">体重: {userData.weight_kg} kg</p>
    </div>
  )
}
