// src/utils/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

/**
 * App Routerのサーバーコンポーネントなどで使う標準的なSupabaseクライアント
 */
export function createSupabaseServerClient() {
  return createServerComponentClient<Database>({ cookies })
}

/**
 * APIルートなどで cookieStore を受け取って使うための汎用Supabaseクライアント
 */
export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
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
