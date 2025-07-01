// src/app/planning/[id]/page.tsx

interface Props {
  params: {
    id: string;
  };
}

export default function PlanningDetailPage({ params }: Props) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        計画詳細（ID: {params.id})
      </h1>
      <p>このページは詳細表示用のプレースホルダです。</p>
    </main>
  );
}
