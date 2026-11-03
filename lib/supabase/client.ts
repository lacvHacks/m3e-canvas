import { createBrowserClient } from '@supabase/ssr'

/** Browser Supabase client (same project as Empresa Control Q&A). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
