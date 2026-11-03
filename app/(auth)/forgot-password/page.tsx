"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { forgotPasswordAction } from "@/lib/actions/auth"
import { useT } from "@/lib/auth/i18n"
import {
  AuthAlert,
  AuthDivider,
  AuthHeading,
  AuthSuccess,
  BrandLockup,
  PrimaryButton,
  TextField,
  authStyles as styles,
} from "@/components/auth/auth-ui"

export default function ForgotPasswordPage() {
  const t = useT()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await forgotPasswordAction(formData)

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
      <AuthHeading title={t("auth.forgot.title")} subtitle={t("auth.forgot.subtitle")} />
      <form action={handleSubmit} className={styles.form}>
        {error && <AuthAlert>{error}</AuthAlert>}
        {success && <AuthSuccess>{success}</AuthSuccess>}
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
        <PrimaryButton loading={loading} withArrow>
          {loading ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
        </PrimaryButton>
        <AuthDivider>
          {t("auth.forgot.remember")}{" "}
          <Link href="/login" className={styles.link}>
            {t("auth.forgot.back")}
          </Link>
        </AuthDivider>
      </form>
    </>
  )
}
