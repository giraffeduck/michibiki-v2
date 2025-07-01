// src/app/auth/signin-redirect/SignInRedirectClient.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInRedirectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const stravaId = searchParams.get("strava_id") || "";
  const email = stravaId ? `strava_${stravaId}@example.com` : emailParam;
  const password = stravaId ? `strava_${stravaId}_dummy_password` : "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doSignIn = async () => {
      if (!email || !stravaId) {
        setError("認証情報が取得できません。");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const data = await res.json();
        if (res.status !== 200) {
          setError("認証エラー: " + (data.error || ""));
        } else {
          router.replace("/dashboard");
        }
      } catch {
        setError("認証処理に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    doSignIn();
  }, [email, password, stravaId, router]);

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">サインインしています...</h1>
      {loading && <p>お待ちください...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}
