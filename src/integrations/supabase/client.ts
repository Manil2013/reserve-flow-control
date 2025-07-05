
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://gbrsvpidhgvofnpifbnh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicnN2cGlkaGd2b2ZucGlmYm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTAxODgsImV4cCI6MjA2NzA4NjE4OH0.2SNfTNWqucGgili7iG9fnXjoOE-8SJIQptlwyNszYQM'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
