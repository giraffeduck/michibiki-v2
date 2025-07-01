// src/app/auth/signin-redirect/page.tsx
import { Suspense } from "react";
import SignInRedirectClient from "./SignInRedirectClient";

export default function SignInRedirectPage() {
  return (
    <Suspense fallback={<div>サインイン中...</div>}>
      <SignInRedirectClient />
    </Suspense>
  );
}
