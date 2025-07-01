// src/app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("SignIn error:", error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({});
}
