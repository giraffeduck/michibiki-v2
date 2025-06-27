// src/utils/supabase/server.ts
import { createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

/**
 * App Routerのサーバーコンポーネントなどで使う標準的なSupabaseクライアント
 */
export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  ) as ReturnType<typeof createClient<Database>>
}

/**
 * APIルートなどで cookieStore を受け取って使うための汎用Supabaseクライアント
 */
export function createSupabaseClientWithCookies(cookieStore: ReturnType<typeof cookies>) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  ) as ReturnType<typeof createClient<Database>>
}

/**
 * 認証済みユーザーを取得（主にサーバーコンポーネントで使用）
 */
export async function getCurrentUser() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Strava ID で userプロフィール情報を取得
 */
export async function getProfile(stravaId: number) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('strava_id', stravaId)
    .maybeSingle()

  return data
}
