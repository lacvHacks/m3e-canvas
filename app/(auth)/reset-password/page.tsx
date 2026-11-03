"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { withBasePath } from "@/lib/auth/base-path"
import { translateError, useT } from "@/lib/auth/i18n"
import {
  AuthAlert,
  AuthDivider,
  AuthHeading,
  AuthSuccess,
  BrandLockup,
  PasswordField,
  PrimaryButton,
  authStyles as styles,
} from "@/components/auth/auth-ui"

/* The reset email goes through /auth/callback, which opens a session and sends
 * the browser here; the new password is saved on that session. */
export default function ResetPasswordPage() {
  const t = useT()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const password = formData.get("password") as string
    if (password !== formData.get("confirm")) {
      setError(t("auth.reset.mismatch"))
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        setError(t("auth.reset.noSession"))
        setLoading(false)
        return
      }
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(translateError(updateError.message))
        setLoading(false)
        return
      }
      setSuccess(t("auth.reset.success"))
      window.location.assign(withBasePath("/app"))
    } catch (e) {
      setError(translateError(e instanceof Error ? e.message : null))
      setLoading(false)
    }
  }

  return (
    <>
      <BrandLockup />
      <AuthHeading title={t("auth.reset.title")} subtitle={t("auth.reset.subtitle")} />
      <form action={handleSubmit} className={styles.form}>
        {error && <AuthAlert>{error}</AuthAlert>}
        {success && <AuthSuccess>{success}</AuthSuccess>}
        <PasswordField
          id="password"
          name="password"
          placeholder={t("auth.reset.password")}
          autoComplete="new-password"
          required
          disabled={loading}
          minLength={6}
        />
        <PasswordField
          id="confirm"
          name="confirm"
          placeholder={t("auth.reset.confirm")}
          autoComplete="new-password"
          required
          disabled={loading}
          minLength={6}
        />
        <PrimaryButton loading={loading} withArrow>
          {loading ? t("auth.reset.submitting") : t("auth.reset.submit")}
        </PrimaryButton>
        <AuthDivider>
          <Link href="/forgot-password" className={styles.link}>
            {t("auth.forgot.title")}
          </Link>
        </AuthDivider>
      </form>
    </>
  )
}
