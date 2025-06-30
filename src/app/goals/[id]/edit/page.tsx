// src/app/goals/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Goal = {
  id: string;
  race_name: string;
  race_date: string;
  priority: string;
  total_target_time: string | null;
  swim_distance_m: number | null;
  swim_target_time: string | null;
  bike_distance_km: number | null;
  bike_target_time: string | null;
  run_distance_km: number | null;
  run_target_time: string | null;
};

export default function EditGoalPage(props: { params: { id: string } }) {
  const { params } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Goal>>({});

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/goals`);
        if (!res.ok) {
          throw new Error('データ取得に失敗しました');
        }
        const { data } = await res.json();
        const goal = data.find((g: Goal) => g.id === params.id);
        if (!goal) {
          throw new Error('目標が見つかりませんでした');
        }
        setForm(goal);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/goals/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '更新に失敗しました');
      }
      router.push('/goals');
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">目標を編集</h1>
      {/* 以下フォームは前回と同じなので省略 */}
      {/* ... */}
    </main>
  );
}
