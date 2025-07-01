// src/app/planning/[id]/page.tsx
import { type PageProps } from "next";

export default function PlanningDetailPage({ params }: PageProps) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        計画詳細（ID: {params.id})
      </h1>
      <p>このページは詳細表示用のプレースホルダです。</p>
    </main>
  );
}
