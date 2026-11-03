import { createClient } from '@/lib/supabase/server'
import { safeNext } from '@/lib/auth/i18n'
import { NextResponse } from 'next/server'

/* Email links (sign-up confirmation, password reset) land here. Redirects are
 * built on NEXT_PUBLIC_SITE_URL (https://www.lacv.space/androidcanvas in
 * production) or on this request's origin plus the base path. */
export async function GET(request: Request) {
  const { searchParams, origin: reqOrigin } = new URL(request.url)
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL || `${reqOrigin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}`
  ).replace(/\/$/, '')
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch {
      // Supabase not configured or unreachable.
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
