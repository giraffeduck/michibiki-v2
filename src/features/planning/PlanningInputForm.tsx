// src/features/planning/PlanningInputForm.tsx
'use client';

import React, { useState } from 'react';

export default function PlanningInputForm() {
  const [weeklyHours, setWeeklyHours] = useState<number>(8);
  const [swimPct, setSwimPct] = useState<number>(20);
  const [bikePct, setBikePct] = useState<number>(50);
  const [runPct, setRunPct] = useState<number>(30);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any>(null);

  const totalPct = swimPct + bikePct + runPct;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalPct !== 100) {
      setError('種目割合の合計は100%にしてください。');
      return;
    }
    if (weeklyHours <= 0) {
      setError('週間トレーニング時間は1時間以上で入力してください。');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/planning/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weeklyHours,
          swimPct,
          bikePct,
          runPct,
        }),
      });

      if (!res.ok) {
        throw new Error('APIエラー');
      }

      const data = await res.json();
      setResponseData(data);
    } catch (err) {
      console.error(err);
      setError('送信中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-[#009F9D]">
        トレーニング計画を作成
      </h2>

      <div className="space-y-2">
        <label className="font-medium text-[#009F9D]">
          週間トレーニング時間（時間）
        </label>
        <input
          type="number"
          min={1}
          max={30}
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(Number(e.target.value))}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="space-y-4">
        <label className="block font-medium text-[#009F9D]">
          種目割合（合計100%）
        </label>
        {[
          { label: 'スイム', value: swimPct, setter: setSwimPct },
          { label: 'バイク', value: bikePct, setter: setBikePct },
          { label: 'ラン', value: runPct, setter: setRunPct },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={item.value}
              onChange={(e) => item.setter(Number(e.target.value))}
              className="w-full accent-[#009F9D]"
            />
          </div>
        ))}
        <p
          className={`text-sm ${
            totalPct === 100 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          合計: {totalPct}%
        </p>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#009F9D] text-white font-semibold py-2 rounded hover:bg-teal-700 transition"
      >
        {isSubmitting ? '送信中...' : '計画を生成する'}
      </button>

      {responseData && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold text-[#009F9D] mb-2">
            生成された年間計画
          </h3>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}
