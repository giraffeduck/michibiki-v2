// src/app/dashboard/SyncButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    const res = await fetch('/api/strava/sync', { method: 'GET' });

    if (!res.ok) {
      alert('同期に失敗しました');
      setIsSyncing(false);
      return;
    }

    startTransition(() => {
      router.refresh();
      setIsSyncing(false);
    });
  };

  return (
    <button
      onClick={handleSync}
      disabled={isPending || isSyncing}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isSyncing ? '同期中...' : '最新データを取得'}
    </button>
  );
}
