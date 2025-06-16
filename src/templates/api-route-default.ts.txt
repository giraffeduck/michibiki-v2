// /templates/api-route-default.ts

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase' // Supabase型定義（プロジェクト依存）

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  // 認証チェック（RLSを効かせるために user を取得）
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // リクエストボディの取得
  const body = await req.json()

  // データの挿入（例：feedback_logテーブル）
  const { error: insertError } = await supabase.from('your_table_name').insert({
    user_id: user.id,
    ...body,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
