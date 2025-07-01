# 📘 Michibiki DBスキーマ

このドキュメントは Michibiki プロジェクトの最新DBスキーマ定義です。  
変更がある場合はこのファイルも更新してください。

---

## 🗂 テーブル: `users`

| カラム名          | データ型           | 主キー/制約       | 説明                                        |
|-------------------|--------------------|-------------------|-------------------------------------------|
| id                | UUID               | PK                | Supabase AuthのユーザーIDと連携            |
| name              | TEXT               |                   | ユーザー名（Stravaから取得）               |
| gender            | TEXT               |                   | 性別 ('Male', 'Female', 'Other')          |
| birth_date        | DATE               |                   | 生年月日                                   |
| weight_kg         | NUMERIC(4,1)       |                   | 体重 (kg)                                  |
| ftp               | INTEGER            |                   | FTP (W)                                   |
| run_5k_time       | INTERVAL           |                   | 5kmベストタイム                           |
| swim_400m_time    | INTERVAL           |                   | 400mベストタイム                          |
| week_start_day    | TEXT               |                   | 週の開始日 ('Sunday' or 'Monday')        |
| email             | TEXT               |                   | 連絡用メールアドレス                      |
| timezone          | TEXT               |                   | IANAタイムゾーン (例: 'Asia/Tokyo')       |
| language          | TEXT               |                   | 言語設定 ('ja', 'en'など)                |
| plan              | TEXT               |                   | 課金プラン ('free', 'premium')            |
| created_at        | TIMESTAMPTZ        |                   | 作成日時                                   |
| updated_at        | TIMESTAMPTZ        |                   | 最終更新日時                               |
| onboarding_completed | BOOLEAN         | DEFAULT false     | オンボーディング完了フラグ                  |

---

## 🗂 テーブル: `external_connections`

| カラム名        | データ型           | 主キー/制約               | 説明                              |
|-----------------|--------------------|---------------------------|---------------------------------|
| id              | UUID               | PK                        | 連携情報の一意ID                |
| user_id         | UUID               | FK → users.id             | ユーザーID                      |
| provider        | TEXT               |                           | サービス提供元 ('strava'など)   |
| external_id     | TEXT               |                           | 例: Strava athlete.id          |
| credentials     | JSONB (暗号化)     |                           | 認証情報                        |
| created_at      | TIMESTAMPTZ        |                           | 作成日時                        |
| updated_at      | TIMESTAMPTZ        |                           | 最終更新日時                    |

---

## 🗂 テーブル: `goals`

| カラム名             | データ型         | 主キー/制約          | 説明                                      |
|----------------------|------------------|----------------------|-----------------------------------------|
| id                   | UUID             | PK                   | 目標の一意ID                             |
| user_id              | UUID             | FK → users.id        | ユーザーID                               |
| race_name            | TEXT             |                      | レース名                                 |
| race_date            | DATE             |                      | レース開催日                             |
| priority             | TEXT             |                      | レース優先度 ('A_RACE'など)             |
| total_target_time    | INTERVAL         |                      | 合計目標タイム                           |
| swim_distance_m      | INTEGER          |                      | スイム距離 (m)                           |
| swim_target_time     | INTERVAL         |                      | スイム目標タイム                         |
| bike_distance_km     | NUMERIC(4,1)     |                      | バイク距離 (km)                          |
| bike_target_time     | INTERVAL         |                      | バイク目標タイム                         |
| run_distance_km      | NUMERIC(4,1)     |                      | ラン距離 (km)                            |
| run_target_time      | INTERVAL         |                      | ラン目標タイム                           |
| created_at           | TIMESTAMPTZ      |                      | 作成日時                                  |
| updated_at           | TIMESTAMPTZ      |                      | 最終更新日時                              |

---

## 🗂 テーブル: `weekly_feedbacks`

| カラム名            | データ型         | 主キー/制約       | 説明                                  |
|---------------------|------------------|-------------------|-------------------------------------|
| id                  | UUID             | PK                | フィードバックの一意ID              |
| user_id             | UUID             | FK → users.id     | ユーザーID                           |
| week_start_date     | DATE             |                   | 対象週の開始日                       |
| feedback_text       | TEXT             |                   | フィードバック本文                  |
| total_tss           | INTEGER          |                   | 週合計TSS                            |
| total_duration      | INTERVAL         |                   | 合計時間                             |
| total_distance_km   | NUMERIC(5,1)     |                   | 合計距離 (km)                        |
| created_at          | TIMESTAMPTZ      |                   | 作成日時                              |
| updated_at          | TIMESTAMPTZ      |                   | 最終更新日時                          |

---

## 🗂 テーブル: `activities` (2025/6/29更新)
| カラム名                      | データ型        | 主キー/制約                             | 説明                            |
| ------------------------- | ----------- | ---------------------------------- | ----------------------------- |
| id                        | BIGINT      | PK (自動採番)                          |                               |
| user_id                  | UUID        | FK → users.id                      | ユーザーID                        |
| external_id              | TEXT        |                                    | 活動ID (文字列)                    |
| provider                  | TEXT        |                                    | データ提供元 ('strava'など)           |
| name                      | TEXT        |                                    | 活動名                           |
| type                      | TEXT        |                                    | 活動タイプ ('Run', 'Ride', 'Swim') |
| start_date               | TIMESTAMPTZ |                                    | 活動開始日時                        |
| distance_m               | FLOAT       |                                    | 距離 (m)                        |
| duration_s               | FLOAT       |                                    | 活動時間 (秒)                      |
| total_elevation_gain_m | INTEGER     |                                    | 獲得標高 (m)                      |
| average_heartrate        | FLOAT       |                                    | 平均心拍                          |
| max_heartrate            | INTEGER     |                                    | 最大心拍                          |
| average_watts            | FLOAT       |                                    | 平均ワット (サイクリング)                |
| average_cadence          | FLOAT       |                                    | 平均ケイデンス                       |
| raw_data                 | JSONB       |                                    | APIからの生データ                    |
| created_at               | TIMESTAMPTZ |                                    | 作成日時                          |
| updated_at               | TIMESTAMPTZ |                                    | 最終更新日時                        |
|                           |             | **UNIQUE(provider, external_id)** |                               |
|                           |             | **INDEX(user_id)**                |                               |

---

## training_plans

| カラム名               | 型              | 説明                                                        |
|---------------------|---------------|-----------------------------------------------------------|
| id                  | uuid          | プライマリキー（自動生成）                                        |
| user_id             | uuid          | ユーザーID（`auth.users` テーブルと紐づく / RLSで制御）               |
| race_date           | date          | 計画の対象となるAレースの日付                                       |
| start_date          | date          | 計画の開始日                                                  |
| weeks_total         | integer       | Aレースまでの総週数                                              |
| phase_base_weeks    | integer       | 基礎期の週数                                                  |
| phase_build_weeks   | integer       | ビルド期の週数                                                 |
| phase_peak_weeks    | integer       | 仕上げ期の週数                                                 |
| phase_taper_weeks   | integer       | テーパー期の週数                                                |
| weekly_hours        | integer       | 週間トレーニング時間（ユーザーが設定）                                     |
| discipline_ratio    | jsonb         | 種目割合 `{ "swim": number, "bike": number, "run": number }` |
| created_at          | timestamp     | 作成日時（`timezone('utc', now())`）                        |

### Row Level Security (RLS)

- 有効化済み
- ポリシー: `auth.uid() = user_id` の行のみ操作可能

---