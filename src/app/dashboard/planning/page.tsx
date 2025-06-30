// src/app/dashboard/planning/page.tsx
import { Suspense } from 'react';
import PlanningInputForm from '@/features/planning/PlanningInputForm';

export default function PlanningPage() {
  return (
    <div className="min-h-screen bg-[#F1FAEE] py-10">
      <Suspense fallback={<div>読み込み中...</div>}>
        <PlanningInputForm />
      </Suspense>
    </div>
  );
}
