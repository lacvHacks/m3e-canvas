"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { loginAction } from "@/lib/actions/auth"
import { useT } from "@/lib/auth/i18n"
import {
  AuthAlert,
  AuthDivider,
  AuthHeading,
  BrandLockup,
  PasswordField,
  PrimaryButton,
  TextField,
  authStyles as styles,
} from "./auth-ui"

export type LoginInitialError = "deactivated" | "auth-code-error" | null

export function LoginForm({
  initialError = null,
  next = null,
}: {
  initialError?: LoginInitialError
  /** where to go after signing in (an in-app path; the proxy sets it) */
  next?: string | null
}) {
  const t = useT()
  const [error, setError] = useState<string | null>(
    initialError === "deactivated"
      ? t("errors.accountDeactivated")
      : initialError === "auth-code-error"
        ? t("errors.authCode")
        : null
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    if (next) formData.set("next", next)
    // A shared design link (#docz=…) survives the redirect to /login; carry it on to the editor.
    formData.set("hash", window.location.hash)

    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <BrandLockup />
      <AuthHeading title={t("auth.login.title")} />
      <form action={handleSubmit} className={styles.form}>
        {error && <AuthAlert>{error}</AuthAlert>}
        <TextField
          id="email"
          name="email"
          type="email"
          placeholder={t("auth.email")}
          icon={Mail}
          autoComplete="email"
          required
          disabled={loading}
        />
        <PasswordField
          id="password"
          name="password"
          placeholder={t("auth.password")}
          autoComplete="current-password"
          required
          disabled={loading}
        />
        <div className={styles.row}>
          <label className={styles.remember}>
            <input
              type="checkbox"
              name="remember"
              defaultChecked
              className={styles.rememberInput}
              disabled={loading}
            />
            <span className={styles.rememberBox} aria-hidden="true" />
            {t("auth.login.remember")}
          </label>
          <Link href="/forgot-password" className={styles.link}>
            {t("auth.login.forgot")}
          </Link>
        </div>
        <PrimaryButton loading={loading} withArrow>
          {loading ? t("auth.login.submitting") : t("auth.login.submit")}
        </PrimaryButton>
        <AuthDivider>
          {t("auth.login.noAccount")}{" "}
          <Link href="/signup" className={styles.link}>
            {t("auth.login.signupLink")}
          </Link>
        </AuthDivider>
      </form>
    </>
  )
}
