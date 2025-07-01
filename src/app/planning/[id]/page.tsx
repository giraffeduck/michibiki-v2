// src/app/planning/[id]/page.tsx

export default function PlanningDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 一行だけ追加
  console.log("searchParams:", searchParams);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        計画詳細（ID: {params.id}）
      </h1>
      <p>このページは詳細表示用のプレースホルダです。</p>
    </main>
  );
}
