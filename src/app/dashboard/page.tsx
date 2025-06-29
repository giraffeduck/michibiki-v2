// src/app/dashboard/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SyncButton } from './SyncButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Supabase getUser error:', error.message);
  }

  if (!user) {
    redirect('/');
  }

  const { data: activities, error: activitiesError } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })
    .limit(50);

  if (activitiesError) {
    throw new Error(activitiesError.message);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">アクティビティ履歴</h1>
        <SyncButton />
      </div>
      {activities.length === 0 ? (
        <p>まだアクティビティが登録されていません。</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 text-left">日付</th>
              <th className="px-2 py-1 text-left">種別</th>
              <th className="px-2 py-1 text-left">タイトル</th>
              <th className="px-2 py-1 text-right">距離 (km)</th>
              <th className="px-2 py-1 text-right">時間 (分)</th>
              <th className="px-2 py-1 text-right">平均心拍</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => (
              <tr key={act.external_id} className="border-t">
                <td className="px-2 py-1">
                  {new Date(act.start_date).toLocaleDateString()}
                </td>
                <td className="px-2 py-1">{act.type}</td>
                <td className="px-2 py-1">{act.name}</td>
                <td className="px-2 py-1 text-right">
                  {(act.distance_m / 1000).toFixed(1)}
                </td>
                <td className="px-2 py-1 text-right">
                  {(act.duration_s / 60).toFixed(1)}
                </td>
                <td className="px-2 py-1 text-right">
                  {act.average_heartrate ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
