// src/app/planning/page.tsx
import Link from "next/link";

export default function PlanningListPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">トレーニング計画一覧</h1>
      <p>まだ実装は完了していません。</p>
      <div className="mt-4">
        <Link
          href="/planning/create"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          新しい計画を作成
        </Link>
      </div>
    </main>
  );
}
