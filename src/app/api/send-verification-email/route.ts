// src/app/api/send-verification-email/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import jwt from 'jsonwebtoken'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { email, user_id } = await req.json()

  if (!email || !user_id) {
    return NextResponse.json({ error: 'メールアドレスまたはuser_idが不足しています' }, { status: 400 })
  }

  // 重複チェック
  const { data: existingUsers, error: queryError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)

  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 })
  }

  if (existingUsers.length > 0) {
    return NextResponse.json({ error: 'このメールアドレスは既に使用されています' }, { status: 409 })
  }

  // トークン発行（署名付きJWT、有効期限10分）
  const token = jwt.sign(
    { email, user_id }, // ← strava_id の代わりに user_id を使う
    process.env.EMAIL_VERIFICATION_SECRET!,
    { expiresIn: '10m' }
  )

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`

  try {
    await resend.emails.send({
      from: process.env.EMAIL_SENDER_ADDRESS!,
      to: email,
      subject: '【Michibiki】メールアドレスの確認',
      html: `
        <p>以下のリンクをクリックしてメールアドレスを確認してください。</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>有効期限は10分間です。</p>
      `,
    })

    return NextResponse.json({ message: '確認メールを送信しました' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 })
  }
}
