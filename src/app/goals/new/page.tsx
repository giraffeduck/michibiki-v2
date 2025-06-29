// src/app/goals/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewGoalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    race_name: '',
    race_date: '',
    priority: 'A_RACE',
    total_target_time: '',
    swim_distance_m: '',
    swim_target_time: '',
    bike_distance_km: '',
    bike_target_time: '',
    run_distance_km: '',
    run_target_time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '登録に失敗しました');
      }

      router.push('/goals');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('不明なエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新規目標を作成</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">レース名*</label>
          <input
            name="race_name"
            value={form.race_name}
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
            value={form.race_date}
            onChange={handleChange}
            required
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block font-medium">優先度</label>
          <select
            name="priority"
            value={form.priority}
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
            value={form.total_target_time}
            onChange={handleChange}
            placeholder="11:00:00"
            className="w-full border p-2"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">スイム距離 (m)</label>
            <input
              name="swim_distance_m"
              value={form.swim_distance_m}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block font-medium">スイム目標タイム</label>
            <input
              name="swim_target_time"
              value={form.swim_target_time}
              onChange={handleChange}
              placeholder="01:10:00"
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">バイク距離 (km)</label>
            <input
              name="bike_distance_km"
              value={form.bike_distance_km}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block font-medium">バイク目標タイム</label>
            <input
              name="bike_target_time"
              value={form.bike_target_time}
              onChange={handleChange}
              placeholder="05:30:00"
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">ラン距離 (km)</label>
            <input
              name="run_distance_km"
              value={form.run_distance_km}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block font-medium">ラン目標タイム</label>
            <input
              name="run_target_time"
              value={form.run_target_time}
              onChange={handleChange}
              placeholder="04:00:00"
              className="w-full border p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#009F9D] text-white rounded hover:bg-[#00807f] disabled:opacity-50"
        >
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>
    </main>
  );
}
