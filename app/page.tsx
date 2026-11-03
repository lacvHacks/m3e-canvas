import { redirect } from "next/navigation";

/* The editor lives at /app: on lacv.space the bare /androidcanvas address is the
 * product's landing page (served by the main site), so the app root only forwards. */
export default function Root() {
  redirect("/app");
}
