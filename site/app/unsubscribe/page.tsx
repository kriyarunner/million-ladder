import { Suspense } from "react";
import type { Metadata } from "next";
import Unsubscribe from "@/components/Unsubscribe";

export const metadata: Metadata = {
  title: "Afmeld nyhedsbrev · Million Ladder",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Unsubscribe lang="da" />
    </Suspense>
  );
}
