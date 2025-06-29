
C:\Users\ryuic\michibiki-app\src\app\api\activities\week\route.ts
C:\Users\ryuic\michibiki-app\src\app\api\auth\callback\route.ts
C:\Users\ryuic\michibiki-app\src\app\api\auth\signin\route.ts
C:\Users\ryuic\michibiki-app\src\app\api\onboarding\route.ts
C:\Users\ryuic\michibiki-app\src\app\api\send-verification-email\route.ts
C:\Users\ryuic\michibiki-app\src\app\api\user\settings\route.ts
C:\Users\ryuic\michibiki-app\src\app\api\verify-email\route.ts


このドキュメントは Michibiki のAPIエンドポイント定義です。
修正がある場合はこのファイルも更新してください。

🔹 GET /api/activities/week
概要
指定したISO週のアクティビティ一覧を取得する。

認証
必須（セッションクッキー）

クエリパラメータ
パラメータ: week
型: string
説明: ISO週（例: 2025-W24）

レスポンスBody
成功:
{
"data": [
{
"id": 123,
"name": "Morning Ride",
"type": "Ride",
"start_date": "2025-06-01T00:00:00Z",
"distance_m": 50000,
"duration_s": 7200,
"average_heartrate": 145,
"average_watts": 200
}
]
}

失敗:
{
"error": "Unauthorized"
}

ステータスコード
200: 取得成功
400: パラメータ不足
401: 認証エラー
500: サーバーエラー

🔹 GET /api/auth/callback
概要
Strava認証フローのコールバック処理。アクセストークンとAthlete情報を取得し、Supabaseユーザーを作成または再利用する。

認証
不要

クエリパラメータ
パラメータ: code
型: string
説明: Strava認証コード

処理
Stravaアクセストークン取得

Supabaseユーザー作成・更新

external_connectionsに認証情報をUpsert

完了後 /auth/callback/confirm にリダイレクト

ステータスコード
302: 成功またはエラー時リダイレクト

🔹 POST /api/auth/signin
概要
Supabaseメール/パスワード認証を行い、セッションクッキーを発行する。

認証
不要

リクエストBody
{
"email": "string",
"password": "string"
}

レスポンスBody
成功:
{}

失敗:
{
"error": "Invalid credentials"
}

ステータスコード
200: 認証成功
401: 認証失敗

🔹 POST /api/onboarding
概要
Onboarding画面でメールアドレスを保存する。

認証
なし（user_idをリクエストで渡す）

リクエストBody
{
"user_id": "string",
"email": "string"
}

レスポンスBody
成功:
{
"message": "Email saved"
}

失敗:
{
"error": "Database update failed"
}

ステータスコード
200: 更新成功
400: パラメータ不足
500: サーバーエラー

🔹 POST /api/send-verification-email
概要
メールアドレス確認用のメールを送信する。

認証
なし

リクエストBody
{
"email": "string",
"user_id": "string"
}

レスポンスBody
成功:
{
"message": "Verification email sent"
}

失敗:
{
"error": "Reason"
}

ステータスコード
200: 送信成功
400: パラメータ不足
409: 既に同じメールが存在
500: サーバーエラー

🔹 GET /api/verify-email
概要
メールアドレス確認リンクから呼び出され、ユーザーのemailを確定・検証済みにする。

認証
不要（トークンによる検証）

クエリパラメータ
パラメータ: token
型: string
説明: JWT

処理
JWT検証

usersテーブルにemailとemail_verified=trueをセット

/onboarding/step2にリダイレクト

ステータスコード
302: 成功またはエラー時リダイレクト

🔹 POST /api/user/settings
概要
ユーザーの基本設定情報を更新する。

認証
必須（セッションクッキー）

リクエストBody
{
"week_start_day": "Monday",
"timezone": "Asia/Tokyo",
"gender": "Male",
"birth_date": "1990-01-01",
"email": "user@example.com",
"weight_kg": 65.5,
"ftp": 250,
"run_5k_time": "00:20:00",
"swim_400m_time": "00:06:30"
}

レスポンスBody
成功:
{
"success": true
}

失敗:
{
"error": "Failed to update user settings"
}

ステータスコード
200: 更新成功
401: 認証エラー
500: サーバーエラー