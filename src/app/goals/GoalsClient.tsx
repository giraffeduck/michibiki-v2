'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Goal = {
  id: string;
  race_name: string;
  race_date: string;
  priority: string;
  total_target_time: string | null;
};

export default function GoalsClient() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch('/api/goals');
        if (!res.ok) {
          throw new Error('データ取得に失敗しました');
        }
        const { data } = await res.json();
        setGoals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/goals/new"
          className="inline-block px-4 py-2 bg-[#009F9D] text-white rounded hover:bg-[#00807f]"
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
                <td className="p-2 border">{goal.total_target_time ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
