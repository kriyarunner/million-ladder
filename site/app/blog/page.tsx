import type { Metadata } from "next";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Guides & mindset — Million Ladder",
  description:
    "Rolige, praktiske guides om at rydde op, sælge smartere og bygge vanen bag Million Ladder. Ingen hype — bare ting, der virker.",
  alternates: {
    canonical: "https://millionladder.com/blog",
    languages: {
      "da-DK": "https://millionladder.com/blog",
      en: "https://millionladder.com/en/blog",
      "x-default": "https://millionladder.com/blog",
    },
  },
  openGraph: {
    title: "Guides & mindset — Million Ladder",
    description:
      "Praktiske guides om at rydde op, sælge smartere og bygge en vane, der holder.",
    url: "https://millionladder.com/blog",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function BlogPage() {
  return <BlogList />;
}
