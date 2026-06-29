import type { MetadataRoute } from "next";
import { allSlugs, getPost } from "@/lib/posts";

const BASE = "https://millionladder.com";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
};

function withAlternates(e: Entry): MetadataRoute.Sitemap[number] {
  const daUrl = `${BASE}${e.path}`;
  const enUrl = `${BASE}/en${e.path === "/" ? "" : e.path}`;
  return {
    url: daUrl,
    lastModified: e.lastModified ?? new Date(),
    changeFrequency: e.changeFrequency,
    priority: e.priority,
    alternates: {
      languages: {
        "da-DK": daUrl,
        en: enUrl,
        "x-default": daUrl,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: Entry[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/udfordring", changeFrequency: "weekly", priority: 0.9 },
    { path: "/blog", changeFrequency: "daily", priority: 0.9 },
    { path: "/simulator", changeFrequency: "monthly", priority: 0.8 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  ];

  const postEntries: Entry[] = allSlugs().map((slug) => {
    const p = getPost("da", slug);
    return {
      path: `/blog/${slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: p ? new Date(p.date + "T00:00:00") : new Date(),
    };
  });

  return [...staticEntries, ...postEntries].map(withAlternates);
}
