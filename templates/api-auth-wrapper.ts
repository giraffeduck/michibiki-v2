// /templates/api-auth-wrapper.ts

import { cookies } from 'next/headers'

// ✅ Cookieから user_id を取得（async対応済み）
export async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value ?? null
}
