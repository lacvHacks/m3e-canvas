"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { getT, safeNext, translateError } from "@/lib/auth/i18n"

/** Public base URL of the app (with basePath) for auth email links. */
async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`
}

/** A shared design rides in the URL fragment (#doc= / #docz=); keep it across the login. */
function safeHash(hash: FormDataEntryValue | null): string {
  return typeof hash === "string" && /^#docz?=[\w\-%.~+/=]*$/.test(hash) ? hash : ""
}

export type AuthResult = { error?: string; success?: string }

async function authError(message: string): Promise<AuthResult> {
  return { error: translateError(message) }
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    return authError(e instanceof Error ? e.message : "")
  }
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return authError(error.message)
  }

  revalidatePath("/", "layout")
  redirect(safeNext(formData.get("next") as string | null) + safeHash(formData.get("hash")))
}

export async function signupAction(formData: FormData): Promise<AuthResult> {
  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    return authError(e instanceof Error ? e.message : "")
  }
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = (formData.get("full_name") ?? formData.get("fullName")) as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${await siteUrl()}/auth/callback?next=/app`,
    },
  })

  if (error) {
    return authError(error.message)
  }

  return { success: (await getT())("auth.signup.success") }
}

export async function forgotPasswordAction(formData: FormData): Promise<AuthResult> {
  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    return authError(e instanceof Error ? e.message : "")
  }
  const email = formData.get("email") as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteUrl()}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return authError(error.message)
  }

  return { success: (await getT())("auth.forgot.success") }
}

const SESSION_COOKIE = {
  path: "/",
  maxAge: 0,
  expires: new Date(0),
  sameSite: "lax" as const,
  httpOnly: false,
}

/** Drop Supabase auth cookies. */
async function expireSessionCookies() {
  const cookieStore = await cookies()
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-")) {
      cookieStore.set(cookie.name, "", SESSION_COOKIE)
    }
  }
}

/**
 * Revoke the Supabase session and clear auth cookies.
 * The browser then does a full navigation to /login (with the base path)
 * so the next request to /app is unauthenticated and the proxy sends it
 * back to the login page.
 */
export async function logoutAction() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // Auth can be unreachable; the cookies are still expired below.
  }
  await expireSessionCookies()
  return { ok: true as const }
}
