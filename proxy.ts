import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/* Next 16 calls this file "proxy" (it was "middleware"). Every page needs a
 * Supabase session except the auth screens; static files stay public so AI
 * agents can read agent.md and the editor can load its icons and logos. */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|md|txt|webmanifest|woff2?)$).*)',
  ],
}
