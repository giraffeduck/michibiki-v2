// src/app/dashboard/page.tsx
'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 環境変数を確認
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // Next.js 15対応：Promise型のためawait必須
  const cookieStore = await cookies();

  // get/set/removeラッパー（型安全、any禁止）
  const supabase = createServerClient(
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

  // 認証セッションからユーザー取得
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  console.log('user:', user);
  console.log('sessionError:', sessionError);

  if (sessionError || !user) {
    console.error('ログイン情報が見つかりません', sessionError);
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">ログイン情報が見つかりません</h1>
        <p>Stravaログイン後、もう一度アクセスしてください。</p>
      </div>
    );
  }

  // ユーザーテーブルから追加データ取得
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  console.log('userData:', userData);
  console.log('userError:', userError);

  if (userError || !userData) {
    console.error('ユーザー情報が取得できません', userError);
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">ユーザー情報が取得できませんでした</h1>
        <p>お手数ですが再ログインをお願いします。</p>
      </div>
    );
  }

  // オンボーディング未完了ならリダイレクト
  if (!userData.week_start_day || !userData.weight_kg) {
    console.log('🔁 onboarding 未完了のためリダイレクト');
    return redirect('/onboarding');
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
  );
}
