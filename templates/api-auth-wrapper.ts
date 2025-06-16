// /templates/api-auth-wrapper.ts

import { cookies } from 'next/headers'

// ✅ user_id を Cookie から取得して返す関数
export async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = cookies()
  return cookieStore.get('user_id')?.value ?? null
}
