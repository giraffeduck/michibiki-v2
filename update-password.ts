import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function updatePassword() {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    'bfc119bf-fae1-4f44-b13d-ed77d0bf72c8',
    {
      password: 'strava_20828320_dummy_password',
    }
  )

  if (error) {
    console.error('Error updating password:', error)
  } else {
    console.log('Password updated successfully:', data)
  }
}

updatePassword()
