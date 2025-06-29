// src/app/goals/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GoalsClient = dynamic(() => import('./GoalsClient'), { ssr: false });

export default function GoalsPage() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">目標レース一覧</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <GoalsClient />
      </Suspense>
    </main>
  );
}
