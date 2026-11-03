"use client";

import type { Palette } from "@/lib/tokens";
import { useSignOut } from "@/components/auth/use-sign-out";
import { t as authT } from "@/lib/auth/i18n";
import { IconBtn } from "./ui";

/** Cerrar sesión: drops the Supabase session and loads /login (the canvas work in this browser stays). */
export function SignOutButton({ p, size = 40 }: { p: Palette; size?: number }) {
  const { signOut, pending } = useSignOut();
  return (
    <IconBtn
      icon={pending ? "progress_activity" : "logout"}
      p={p}
      onClick={() => void signOut()}
      disabled={pending}
      title={pending ? authT("auth.loggingOut") : authT("auth.logout")}
      size={size}
    />
  );
}
