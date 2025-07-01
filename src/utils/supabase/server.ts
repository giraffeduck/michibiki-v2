// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

// usersテーブルの型
type UserProfile = Database['public']['Tables']['users']['Row']

/**
 * App Routerのサーバーコンポーネントなどで使う標準的なSupabaseクライアント
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options?: Record<string, unknown>) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

/**
 * APIルートなどで cookieStore を受け取って使うための汎用Supabaseクライアント
 */
export function createSupabaseClientWithCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options?: Record<string, unknown>) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

/**
 * 認証済みユーザーを取得（主にサーバーコンポーネントで使用）
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Strava ID で userプロフィール情報を取得
 */
export async function getProfile(stravaId: number): Promise<UserProfile | null> {
  // 1. cookieStoreを同期で取得
  const cookieStore = cookies();

  // 2. 同期クライアントを生成
  const supabase = createSupabaseClientWithCookies(cookieStore);

  // 3. クエリを実行
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('strava_id', stravaId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }

  return data;
}
