import { permanentRedirect } from "next/navigation";

// The full landing page now lives at "/en". Old preview links are forwarded.
export default function LaunchPage() {
  permanentRedirect("/en");
}
