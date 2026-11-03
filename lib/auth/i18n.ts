/**
 * Spanish strings for the login screens (copied from Empresa Control Q&A).
 * The editor keeps its own translations in lib/i18n.ts; these are only for auth.
 */
const ES = {
  "app.name": "Canvas Apps Movil Android",
  "app.tagline": "Bocetos de pantallas Material 3 Expressive para apps Android · basado en M3E Canvas de lnkiai (MIT)",
  "auth.email": "Correo electrónico",
  "auth.password": "Contraseña",
  "auth.logout": "Cerrar sesión",
  "auth.loggingOut": "Cerrando sesión…",
  "auth.login.title": "Bienvenido de nuevo",
  "auth.login.forgot": "¿Olvidaste tu contraseña?",
  "auth.login.hidePassword": "Ocultar contraseña",
  "auth.login.showPassword": "Mostrar contraseña",
  "auth.login.noAccount": "¿No tienes una cuenta?",
  "auth.login.remember": "Recordarme",
  "auth.login.signupLink": "Regístrate",
  "auth.login.submit": "Iniciar sesión",
  "auth.login.submitting": "Iniciando sesión...",
  "auth.signup.title": "Crear una cuenta",
  "auth.signup.subtitle": "Ingresa tus datos para comenzar",
  "auth.signup.fullName": "Nombre completo",
  "auth.signup.haveAccount": "¿Ya tienes una cuenta?",
  "auth.signup.signinLink": "Inicia sesión",
  "auth.signup.submit": "Crear cuenta",
  "auth.signup.submitting": "Creando cuenta...",
  "auth.signup.success": "Revisa tu correo para confirmar tu cuenta.",
  "auth.forgot.title": "Restablece tu contraseña",
  "auth.forgot.subtitle": "Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña",
  "auth.forgot.submit": "Enviar enlace de restablecimiento",
  "auth.forgot.submitting": "Enviando enlace...",
  "auth.forgot.success": "Revisa tu correo: te enviamos un enlace para restablecer tu contraseña.",
  "auth.forgot.remember": "¿Recuerdas tu contraseña?",
  "auth.forgot.back": "Volver a iniciar sesión",
  "auth.reset.title": "Nueva contraseña",
  "auth.reset.subtitle": "Escribe la nueva contraseña de tu cuenta",
  "auth.reset.password": "Nueva contraseña",
  "auth.reset.confirm": "Repite la nueva contraseña",
  "auth.reset.mismatch": "Las contraseñas no coinciden.",
  "auth.reset.submit": "Guardar contraseña",
  "auth.reset.submitting": "Guardando...",
  "auth.reset.success": "Contraseña actualizada. Abriendo el editor…",
  "auth.reset.noSession": "El enlace caducó o ya se usó. Pide uno nuevo.",
  "errors.generic": "Algo salió mal. Inténtalo de nuevo.",
  "errors.authCode": "No se pudo validar el enlace del correo. Inicia sesión o pide un enlace nuevo.",
  "errors.accountDeactivated": "Tu cuenta ha sido desactivada. Contacta a un administrador.",
  "errors.userAlreadyRegistered": "Ya existe una cuenta con este correo.",
  "errors.invalidCredentials": "Correo o contraseña incorrectos.",
  "errors.emailNotConfirmed": "Confirma tu correo antes de iniciar sesión.",
  "errors.passwordTooShort": "La contraseña debe tener al menos 6 caracteres.",
  "errors.rateLimited": "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  "errors.signupDisabled": "El registro de nuevas cuentas está desactivado.",
  "errors.invalidEmail": "El correo no es válido.",
  "errors.network": "Sin conexión con el servidor. Revisa tu internet.",
  "errors.notConfigured": "El inicio de sesión no está configurado (faltan las variables de Supabase).",
} as const

export type AuthKey = keyof typeof ES
export type TFunction = (key: AuthKey) => string

export const t: TFunction = (key) => ES[key]

/** Same call shape as Empresa Control's i18n hooks, so the copied screens stay alike. */
export function useT(): TFunction {
  return t
}

export async function getT(): Promise<TFunction> {
  return t
}

/** Supabase auth error -> Spanish message (subset of Empresa Control's translateError). */
export function translateError(message: string | null | undefined): string {
  if (!message) return t("errors.generic")
  const m = message.toLowerCase()
  if (m.includes("supabase is not configured")) return t("errors.notConfigured")
  if (m.includes("user is banned") || m.includes("banned")) return t("errors.accountDeactivated")
  if (m.includes("already been registered") || m.includes("email_exists") || m.includes("user already registered"))
    return t("errors.userAlreadyRegistered")
  if (m.includes("invalid login credentials")) return t("errors.invalidCredentials")
  if (m.includes("email not confirmed")) return t("errors.emailNotConfirmed")
  if (m.includes("password should be at least")) return t("errors.passwordTooShort")
  if (m.includes("rate limit") || m.includes("too many requests")) return t("errors.rateLimited")
  if (m.includes("signups not allowed") || m.includes("signup is disabled")) return t("errors.signupDisabled")
  if (m.includes("unable to validate email") || m.includes("invalid email")) return t("errors.invalidEmail")
  if (m.includes("failed to fetch") || m.includes("network") || m.includes("fetch failed")) return t("errors.network")
  return message
}

/** Only same-app paths are accepted as a post-login destination. */
export function safeNext(next: string | null | undefined, fallback = "/app"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback
  return next
}
