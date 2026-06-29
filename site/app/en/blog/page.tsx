import type { Metadata } from "next";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Guides & mindset — Million Ladder",
  description:
    "Calm, practical guides on decluttering, selling smarter and building the habit behind Million Ladder. No hype — just things that work.",
  alternates: {
    canonical: "https://millionladder.com/en/blog",
    languages: {
      "da-DK": "https://millionladder.com/blog",
      en: "https://millionladder.com/en/blog",
      "x-default": "https://millionladder.com/blog",
    },
  },
  openGraph: {
    title: "Guides & mindset — Million Ladder",
    description:
      "Practical guides on decluttering, selling smarter and building a habit that lasts.",
    url: "https://millionladder.com/en/blog",
    locale: "en_US",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function BlogPage() {
  return <BlogList lang="en" />;
}
