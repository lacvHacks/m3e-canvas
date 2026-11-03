import { LoginForm, type LoginInitialError } from "@/components/auth/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next } = await searchParams
  const initialError: LoginInitialError =
    error === "deactivated" || error === "auth-code-error" ? error : null
  return <LoginForm initialError={initialError} next={next ?? null} />
}
