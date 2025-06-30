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

export default function EditGoalPage({ params }: { params: { id: string } }) {
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">レース名*</label>
          <input
            name="race_name"
            value={form.race_name || ''}
            onChange={handleChange}
            required
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block font-medium">開催日*</label>
          <input
            type="date"
            name="race_date"
            value={form.race_date || ''}
            onChange={handleChange}
            required
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block font-medium">優先度</label>
          <select
            name="priority"
            value={form.priority || 'A_RACE'}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="A_RACE">Aレース</option>
            <option value="B_RACE">Bレース</option>
            <option value="C_RACE">Cレース</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">合計目標タイム (hh:mm:ss)</label>
          <input
            name="total_target_time"
            value={form.total_target_time || ''}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">スイム距離 (m)</label>
            <input
              name="swim_distance_m"
              type="number"
              value={form.swim_distance_m ?? ''}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block font-medium">スイム目標タイム</label>
            <input
              name="swim_target_time"
              value={form.swim_target_time || ''}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">バイク距離 (km)</label>
            <input
              name="bike_distance_km"
              type="number"
              value={form.bike_distance_km ?? ''}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block font-medium">バイク目標タイム</label>
            <input
              name="bike_target_time"
              value={form.bike_target_time || ''}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">ラン距離 (km)</label>
            <input
              name="run_distance_km"
              type="number"
              value={form.run_distance_km ?? ''}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block font-medium">ラン目標タイム</label>
            <input
              name="run_target_time"
              value={form.run_target_time || ''}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-[#009F9D] text-white rounded hover:bg-[#00807f]"
        >
          更新する
        </button>
      </form>
    </main>
  );
}
