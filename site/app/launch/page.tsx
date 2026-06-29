import { permanentRedirect } from "next/navigation";

// Den fulde landingsside bor nu på "/". Gamle preview-links sendes videre.
export default function LaunchPage() {
  permanentRedirect("/");
}
