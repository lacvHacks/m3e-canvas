"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, User } from "lucide-react"
import { signupAction } from "@/lib/actions/auth"
import { useT } from "@/lib/auth/i18n"
import {
  AuthAlert,
  AuthDivider,
  AuthHeading,
  AuthSuccess,
  BrandLockup,
  PasswordField,
  PrimaryButton,
  TextField,
  authStyles as styles,
} from "./auth-ui"

export function SignupForm() {
  const t = useT()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await signupAction(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }

    setLoading(false)
  }

  return (
    <>
      <BrandLockup />
      <AuthHeading title={t("auth.signup.title")} subtitle={t("auth.signup.subtitle")} />
      <form action={handleSubmit} className={styles.form}>
        {error && <AuthAlert>{error}</AuthAlert>}
        {success && <AuthSuccess>{success}</AuthSuccess>}
        <TextField
          id="full_name"
          name="full_name"
          placeholder={t("auth.signup.fullName")}
          icon={User}
          autoComplete="name"
          required
          disabled={loading}
        />
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
          autoComplete="new-password"
          required
          disabled={loading}
          minLength={6}
        />
        <PrimaryButton loading={loading} withArrow>
          {loading ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </PrimaryButton>
        <AuthDivider>
          {t("auth.signup.haveAccount")}{" "}
          <Link href="/login" className={styles.link}>
            {t("auth.signup.signinLink")}
          </Link>
        </AuthDivider>
      </form>
    </>
  )
}
