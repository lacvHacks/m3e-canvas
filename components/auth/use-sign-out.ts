"use client"

import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { logoutAction } from "@/lib/actions/auth"
import { withBasePath } from "@/lib/auth/base-path"

/** Remove Supabase auth cookies from this browser (the canvas work in localStorage stays). */
function clearBrowserAuthState() {
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim() ?? "")
    .filter(Boolean)
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "")
  const paths = base ? ["/", base] : ["/"]

  for (const name of names) {
    if (!name.startsWith("sb-")) continue
    for (const path of paths) {
      document.cookie = `${name}=; Path=${path}; Max-Age=0; SameSite=Lax`
    }
  }
}

/**
 * Sign out of Supabase, drop local session state, and load the login page.
 * Uses a full navigation so NEXT_PUBLIC_BASE_PATH is part of the URL
 * (production: /androidcanvas/login) and middleware sees a request
 * without a session.
 */
export function useSignOut() {
  const [pending, setPending] = useState(false)
  const running = useRef(false)

  async function signOut() {
    if (running.current) return
    running.current = true
    setPending(true)

    try {
      const supabase = createClient()
      supabase.auth.stopAutoRefresh()
      await logoutAction()
      await supabase.auth.signOut()
    } catch {
      // Still leave the page: cookies are cleared before the navigation.
    } finally {
      clearBrowserAuthState()
      window.location.assign(withBasePath("/login"))
    }
  }

  return { signOut, pending }
}
