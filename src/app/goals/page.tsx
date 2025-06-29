// src/app/goals/page.tsx
import { createSupabaseClientWithCookies } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function GoalsPage() {
  const supabase = createSupabaseClientWithCookies(await cookies());

  const { data: goals, error } = await supabase
    .from('goals')
    .select('*')
    .order('race_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">目標レース一覧</h1>

      <div className="mb-4">
        <Link
          href="/goals/new"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ＋ 新規目標を作成
        </Link>
      </div>

      {goals.length === 0 ? (
        <p className="text-gray-500">まだ目標は登録されていません。</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">レース名</th>
              <th className="p-2 border">開催日</th>
              <th className="p-2 border">優先度</th>
              <th className="p-2 border">合計目標タイム</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id}>
                <td className="p-2 border">{goal.race_name}</td>
                <td className="p-2 border">{goal.race_date}</td>
                <td className="p-2 border">{goal.priority}</td>
                <td className="p-2 border">
                  {goal.total_target_time ? String(goal.total_target_time) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
