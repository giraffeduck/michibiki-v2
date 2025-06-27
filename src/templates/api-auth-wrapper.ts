// src/templates/api-auth-wrapper.ts
import { createSupabaseClientWithCookies } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * Supabase Auth 認証済みユーザー情報を取得するユーティリティ関数
 * headers() を使用せず cookies() を使うことで、ビルドエラーを回避
 */
export async function getUserFromSession() {
  // ★ここでawait必須！
  const supabase = createSupabaseClientWithCookies(await cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
}
