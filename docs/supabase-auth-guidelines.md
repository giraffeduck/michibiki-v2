//docs/supabase-auth-guidelines.md

# Supabase Auth 運用ガイドライン

このファイルは、StravaログインとSupabase Authを組み合わせた認証フローに関する運用ルールをまとめたものです。

---

## 1. Supabaseクライアント生成

- Supabaseクライアントは `/src/lib/supabase/server.ts` に共通関数 `createClient()` を定義し、必ずこれを利用する。
- APIルートで `createServerClient()` を直接呼ばない。
- `cookies()` は Next.js 15では非同期です。必ず `const cookieStore = await cookies();` とする。

```ts
cookies: {
  get: (name) => cookieStore.get(name)?.value,
  set: (name, value, options) => {
    cookieStore.set({ name, value, ...options });
  },
  remove: (name, options) => {
    cookieStore.delete({ name, ...options });
  },
},

## 2. 認証セッションの取り扱い
signInWithPassword() でセッションを確立する際は Route Handler内では呼ばず、フロントエンドで /api/auth/signin を呼ぶ。
理由: Set-Cookie ヘッダがAPIレスポンス経由ではブラウザに正しく渡らないため。
Strava認証完了後は、フロントエンドで自動的にサインインAPIを呼び、セッションをセットする。

## 3. パスワードリセット
auth.admin.updateUserById() でパスワードを変更した場合、既存のセッションはすべて失効する。
パスワード変更後は再度サインインが必要。

## 4. Cookieの型
Next.jsのバージョンアップ時に cookies() の戻り値が変わる可能性があるため注意する。
型エラーが発生した場合、await cookies() を利用する。
型エラーが出る場合は必ず公式ドキュメントを確認する。

## 5. Stravaログインの流れ（推奨）
Strava OAuthでトークン取得。
Supabase Authにダミーユーザーを登録（メール+パスワード）。
セッションはフロントエンドから /api/auth/signin を呼んで確立する。
SupabaseのRLSは auth.users.id に基づいて適用される。

## 6. 注意点
Supabase Authのユーザーは「ダミーパスワード」で作成し、常に同じパスワードでログインする。
パスワードをリセットしたら、即座にフロントからサインインするか再ログインを促す。
service_role キーは管理用操作に限定し、認証セッション用途には使わない。

