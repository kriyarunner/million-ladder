"use client";

import Link from "next/link";

type Section = { h: string; p: string };

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div className="wrap">
      <Link href="/" className="back">
        <span className="mark">
          <svg viewBox="0 0 1024 1024" aria-hidden>
            <path
              d="M 300 730 L 300 300 L 512 540 L 724 300 L 724 730"
              fill="none"
              stroke="#ffcf4a"
              strokeWidth={106}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </span>
        Million Ladder
      </Link>

      <h1>{title}</h1>
      <p className="updated">Senest opdateret: {updated}</p>
      <p className="intro">{intro}</p>

      {sections.map((s, i) => (
        <section key={i}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </section>
      ))}

      <p className="contact">
        Spørgsmål? Skriv til{" "}
        <a href="mailto:hej@millionladder.com">hej@millionladder.com</a>.
      </p>

      <footer>
        <Link href="/terms">Vilkår</Link> · <Link href="/privacy">Privatliv</Link> ·{" "}
        © {new Date().getFullYear()} Million Ladder
      </footer>

      <style jsx>{`
        .wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }
        .back {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          text-decoration: none;
          font-weight: 800;
          font-size: 16px;
          margin-bottom: 36px;
        }
        .mark {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(135deg, #2bd576, #1fa863);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .mark svg {
          width: 18px;
          height: 18px;
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
        a {
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
    </div>
  );
}
