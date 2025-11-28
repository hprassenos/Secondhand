import { createClient } from '@supabase/supabase-js'

// Use placeholder values for local builds without env vars
// Real values will be provided by Vercel environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Using generic types until database types are generated from actual Supabase schema
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper to check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}
