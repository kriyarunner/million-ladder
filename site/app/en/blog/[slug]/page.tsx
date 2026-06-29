import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "@/components/Article";
import { getPost, allSlugs } from "@/lib/posts";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("en", slug);
  if (!post) return { title: "Guide not found — Million Ladder" };
  const url = `https://millionladder.com/en/blog/${post.slug}`;
  return {
    title: `${post.title} — Million Ladder`,
    description: post.excerpt,
    alternates: {
      canonical: url,
      languages: {
        "da-DK": `https://millionladder.com/blog/${post.slug}`,
        en: url,
        "x-default": `https://millionladder.com/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("en", slug);
  if (!post) notFound();

  const postUrl = `https://millionladder.com/en/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "en",
        image: `${postUrl}/opengraph-image`,
        author: { "@type": "Organization", name: "Million Ladder" },
        publisher: {
          "@type": "Organization",
          name: "Million Ladder",
          logo: {
            "@type": "ImageObject",
            url: "https://millionladder.com/favicon-32.png",
          },
        },
        mainEntityOfPage: postUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://millionladder.com/en",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: "https://millionladder.com/en/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: postUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Article post={post} lang="en" />
    </>
  );
}
