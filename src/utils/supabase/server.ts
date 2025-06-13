// src/utils/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createSupabaseServerClient() {
  return createServerComponentClient<Database>({ cookies })
}

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getProfile(stravaId: number) {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('strava_id', stravaId)
    .maybeSingle()

  return data
}
