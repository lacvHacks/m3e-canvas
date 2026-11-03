import { withBasePath } from "@/lib/auth/base-path"
import { getT } from "@/lib/auth/i18n"
import styles from "@/components/auth/auth-screen.module.css"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getT()

  return (
    <div className={styles.page}>
      <div className={`${styles.blob} ${styles.blobLeft}`} />
      <div className={`${styles.blob} ${styles.blobRight}`} />
      <div className={`${styles.blob} ${styles.blobTop}`} />
      <div className={styles.main}>
        <div className={styles.stage}>
          <img
            src={withBasePath("/login-mascots.png")}
            alt=""
            width={1006}
            height={418}
            className={styles.mascots}
          />
          <div className={styles.card}>{children}</div>
        </div>
      </div>
      <p className={styles.footer}>{t("app.tagline")}</p>
    </div>
  )
}
