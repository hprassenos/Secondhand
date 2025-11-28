// Supabase client for server-side scripts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
// import * as dotenv from 'dotenv'

// Load .env file
// dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
