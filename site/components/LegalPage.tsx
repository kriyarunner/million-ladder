"use client";

import Link from "next/link";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import { type Lang, t, withLocale } from "@/lib/i18n";
import { useSignupModal } from "./SignupModal";

type Section = { h: string; p: string };

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
  lang = "da",
}: {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
  lang?: Lang;
}) {
  const tr = t(lang).legal;
  const { open: openSignup } = useSignupModal();
  return (
    <>
      <SiteNav lang={lang} />
      <div className="wrap">
      <h1>{title}</h1>
      <p className="updated">{tr.updated} {updated}</p>
      <p className="intro">{intro}</p>

      {sections.map((s, i) => (
        <section key={i}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </section>
      ))}

      <p className="contact">
        {tr.contact0}
        <Link
          href={withLocale(lang, "/#download")}
          onClick={(e) => {
            e.preventDefault();
            openSignup();
          }}
        >
          {tr.contactLink}
        </Link>
        {tr.contact1}
      </p>

      </div>

      <SiteFooter lang={lang} />
      <style jsx>{`
        .wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        h1 {
          font-size: clamp(30px, 6vw, 44px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
        }
        .updated {
          color: var(--muted);
          font-size: 13px;
          margin-top: 10px;
        }
        .intro {
          color: #c3cad3;
          font-size: 16px;
          line-height: 1.6;
          margin-top: 22px;
        }
        section {
          margin-top: 30px;
        }
        h2 {
          font-size: 19px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }
        section p {
          color: #c3cad3;
          font-size: 15.5px;
          line-height: 1.65;
        }
        .contact {
          margin-top: 36px;
          color: #c3cad3;
          font-size: 15px;
        }
        .contact :global(a) {
          color: var(--gold);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        footer {
          margin-top: 48px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 13px;
        }
        footer :global(a) {
          color: var(--muted);
        }
        footer :global(a:hover) {
          color: #fff;
        }
      `}</style>
    </>
  );
}
