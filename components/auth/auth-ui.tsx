"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useT } from "@/lib/auth/i18n"
import styles from "./auth-screen.module.css"

export function BrandLockup() {
  return (
    <div className={styles.brand}>
      <svg className={styles.logo} viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="ac-logo" x1="4" y1="36" x2="36" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A879FF" />
            <stop offset="0.48" stopColor="#7028F5" />
            <stop offset="1" stopColor="#5015CC" />
          </linearGradient>
        </defs>
        {/* a phone outline with a canvas frame inside */}
        <path
          fill="url(#ac-logo)"
          fillRule="evenodd"
          d="M13 2h14a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 5v24h14V7H13Zm4.5 27.2a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
        />
        <rect x="15.5" y="10" width="9" height="7" rx="1.6" fill="url(#ac-logo)" />
        <rect x="15.5" y="19.5" width="9" height="2.6" rx="1.3" fill="url(#ac-logo)" />
        <rect x="15.5" y="24.5" width="6" height="2.6" rx="1.3" fill="url(#ac-logo)" />
      </svg>
      <span className={`${styles.brandName} ${styles.brandNameLong}`}>
        Canvas Apps <span className={styles.brandAccent}>Movil Android</span>
      </span>
    </div>
  )
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <h1 className={styles.heading}>{title}</h1>
      {subtitle ? <p className={styles.subheading}>{subtitle}</p> : null}
    </>
  )
}

export function AuthAlert({ children }: { children: ReactNode }) {
  return (
    <div className={styles.alert} role="alert">
      {children}
    </div>
  )
}

export function AuthSuccess({ children }: { children: ReactNode }) {
  return <div className={styles.success}>{children}</div>
}

export function TextField({
  id,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  autoComplete,
  required,
  disabled,
  minLength,
}: {
  id: string
  name: string
  type?: string
  placeholder: string
  icon: LucideIcon
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  minLength?: number
}) {
  return (
    <div className={styles.field}>
      <Icon className={styles.icon} aria-hidden="true" />
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        minLength={minLength}
        className={styles.input}
      />
    </div>
  )
}

export function PasswordField({
  id,
  name,
  placeholder,
  autoComplete,
  required,
  disabled,
  minLength,
}: {
  id: string
  name: string
  placeholder: string
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  minLength?: number
}) {
  const t = useT()
  const [visible, setVisible] = useState(false)
  return (
    <div className={styles.field}>
      <Lock className={styles.icon} aria-hidden="true" />
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        minLength={minLength}
        className={styles.input}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
        disabled={disabled}
      >
        {visible ? <Eye className="h-[18px] w-[18px]" /> : <EyeOff className="h-[18px] w-[18px]" />}
      </button>
    </div>
  )
}

export function PrimaryButton({
  children,
  loading,
  withArrow = false,
}: {
  children: ReactNode
  loading?: boolean
  withArrow?: boolean
}) {
  return (
    <button type="submit" className={styles.submit} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{children}</span>
      {withArrow && !loading ? <ArrowRight className={styles.arrow} /> : null}
    </button>
  )
}

export function AuthDivider({ children }: { children: ReactNode }) {
  return <div className={styles.divider}>{children}</div>
}

export { styles as authStyles }
