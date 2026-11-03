import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Pages anyone can open without a session. */
const PUBLIC_PREFIXES = ['/login', '/signup', '/forgot-password', '/reset-password', '/auth']
/** Pages a signed-in user skips (they go straight to the editor). */
const GUEST_ONLY_PREFIXES = ['/login', '/signup', '/forgot-password']

const startsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`))

/** Send the browser to /login, remembering where it was going (request.nextUrl carries the basePath). */
function toLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  const next = request.nextUrl.pathname + request.nextUrl.search
  url.pathname = '/login'
  url.search = ''
  if (next !== '/' && !next.startsWith('/login')) url.searchParams.set('next', next)
  return NextResponse.redirect(url)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const path = request.nextUrl.pathname
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
    // Supabase not configured -- allow auth pages, redirect others to login
    if (startsWithAny(path, PUBLIC_PREFIXES)) return supabaseResponse
    return toLogin(request)
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Auth unreachable: treat as signed out.
  }

  if (!user && !startsWithAny(path, PUBLIC_PREFIXES)) {
    return toLogin(request)
  }

  if (user && startsWithAny(path, GUEST_ONLY_PREFIXES)) {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
