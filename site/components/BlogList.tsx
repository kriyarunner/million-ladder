"use client";

import Link from "next/link";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import SignupInline from "./SignupInline";
import { getPosts, formatDate, upcomingByLang } from "@/lib/posts";
import { type Lang, t, withLocale } from "@/lib/i18n";
import { useSignupModal } from "./SignupModal";

export default function BlogList({ lang = "da" }: { lang?: Lang }) {
  const tr = t(lang).blogList;
  const { open: openSignup } = useSignupModal();
  const upcoming = upcomingByLang[lang];
  const sorted = [...getPosts(lang)].sort((a, b) => (a.date < b.date ? 1 : -1));
  const [featured, ...rest] = sorted;

  return (
    <>
      <SiteNav active="blog" lang={lang} />
      <div className="wrap">
        <header className="head">
          <span className="eyebrow">
            <span className="pulse" /> {tr.eyebrow}
          </span>
          <h1>{tr.h1}</h1>
          <p className="sub">{tr.sub}</p>
        </header>

        {featured && (
          <Link href={withLocale(lang, `/blog/${featured.slug}`)} className="feat">
            <div className="fbody">
              <span className="tag">{featured.tag}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="meta">
                {formatDate(featured.date, lang)} · {featured.read} {tr.reading}
              </span>
              <span className="read">{tr.readGuide}</span>
            </div>
            <div className="fart" aria-hidden>
              <div className="ladder">
                {[88, 70, 54, 40, 28].map((w, i) => (
                  <span key={i} style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </Link>
        )}

        <div className="teaser">
          <div className="tleft">
            <span className="tbadge">
              <span className="pulse" /> {upcoming.badge}
            </span>
            <span className="ttag">{upcoming.tag}</span>
            <h2>{upcoming.title}</h2>
            <p>{upcoming.teaser}</p>
          </div>
          <Link
            href={withLocale(lang, "/#download")}
            className="tcta"
            onClick={(e) => {
              e.preventDefault();
              openSignup();
            }}
          >
            {tr.notifyFirst}
          </Link>
        </div>

        {rest.length > 0 && (
          <>
            <div className="seclabel">{tr.moreLabel}</div>
            <div className="grid">
              {rest.map((p) => (
                <Link
                  href={withLocale(lang, `/blog/${p.slug}`)}
                  key={p.slug}
                  className="card"
                >
                  <span className="tag">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p className="ex">{p.excerpt}</p>
                  <span className="meta">
                    {formatDate(p.date, lang)} · {p.read}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        <SignupInline
          heading={tr.signupH}
          sub={tr.signupSub}
          variant="green"
          lang={lang}
        />
      </div>

      <SiteFooter lang={lang} />

      <style jsx>{`
        .wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 44px 22px 80px;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--accent);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 0 rgba(43, 213, 118, 0.6);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(43, 213, 118, 0.5);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(43, 213, 118, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(43, 213, 118, 0);
          }
        }
        .teaser {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          flex-wrap: wrap;
          margin-top: 18px;
          padding: 26px 28px;
          border: 1px dashed rgba(255, 207, 74, 0.4);
          background: radial-gradient(circle at 0% 0%, rgba(255, 207, 74, 0.08), transparent 60%),
            var(--surface);
          border-radius: 22px;
        }
        .tleft {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 240px;
          flex: 1;
        }
        .tbadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .tbadge .pulse {
          background: var(--gold);
        }
        .ttag {
          margin-top: 10px;
          color: var(--gold);
          font-family: var(--display);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .teaser h2 {
          font-family: var(--display);
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.18;
          margin: 4px 0 0;
          color: #fff;
        }
        .teaser p {
          color: #c3cad3;
          font-size: 15px;
          line-height: 1.55;
          margin-top: 10px;
          max-width: 520px;
        }
        .tcta {
          flex-shrink: 0;
          background: var(--surface2);
          border: 1px solid rgba(255, 207, 74, 0.4);
          color: var(--gold);
          font-weight: 800;
          font-size: 14px;
          padding: 13px 22px;
          border-radius: 13px;
          white-space: nowrap;
        }
        .tcta:hover {
          background: rgba(255, 207, 74, 0.1);
        }
        h1 {
          font-family: var(--display);
          font-size: clamp(34px, 6vw, 54px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.04;
          margin: 14px 0 0;
        }
        .sub {
          color: #c3cad3;
          font-size: 18px;
          line-height: 1.6;
          margin-top: 18px;
          max-width: 620px;
        }
        .feat {
          position: relative;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 8px;
          margin-top: 40px;
          background: linear-gradient(160deg, var(--surface), var(--bg));
          border: 1px solid var(--line);
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45);
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .feat:hover {
          border-color: rgba(43, 213, 118, 0.4);
          transform: translateY(-3px);
        }
        @media (max-width: 680px) {
          .feat {
            grid-template-columns: 1fr;
          }
        }
        .fbody {
          padding: 40px 34px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .fbody h2 {
          font-family: var(--display);
          font-size: clamp(24px, 3.4vw, 34px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.12;
          margin: 14px 0 0;
          color: #fff;
        }
        .fbody p {
          color: #c3cad3;
          font-size: 16px;
          line-height: 1.6;
          margin-top: 14px;
        }
        .fbody .meta {
          color: var(--muted);
          font-size: 13px;
          font-weight: 600;
          margin-top: 18px;
        }
        .fbody .read {
          color: var(--accent);
          font-weight: 800;
          font-size: 15px;
          margin-top: 18px;
        }
        .fart {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 70% 30%, rgba(43, 213, 118, 0.16), transparent 60%);
          padding: 24px;
        }
        @media (max-width: 680px) {
          .fart {
            display: none;
          }
        }
        .ladder {
          display: flex;
          flex-direction: column-reverse;
          gap: 12px;
          width: 100%;
          max-width: 240px;
        }
        .ladder span {
          height: 16px;
          border-radius: 99px;
          background: linear-gradient(90deg, #1fa863, var(--accent) 55%, var(--accent-light));
          opacity: 0.85;
          box-shadow: 0 0 14px rgba(43, 213, 118, 0.2);
        }
        .ladder span:last-child {
          background: linear-gradient(90deg, var(--gold), #f0a92a);
        }
        .tag {
          align-self: flex-start;
          color: var(--accent);
          background: rgba(43, 213, 118, 0.1);
          border: 1px solid rgba(43, 213, 118, 0.22);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 11px;
          border-radius: 99px;
        }
        .seclabel {
          margin-top: 48px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 18px;
        }
        @media (max-width: 680px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
        .card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.24);
          transition: border-color 0.15s ease, transform 0.12s ease;
        }
        .card:hover {
          border-color: #3a414c;
          transform: translateY(-3px);
        }
        .card h3 {
          font-family: var(--display);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 14px 0 0;
          color: #fff;
        }
        .ex {
          color: var(--muted);
          font-size: 14.5px;
          line-height: 1.55;
          margin-top: 10px;
          flex: 1;
        }
        .meta {
          color: var(--muted);
          font-size: 12.5px;
          font-weight: 600;
          margin-top: 18px;
        }
        .news {
          margin-top: 52px;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(255, 207, 74, 0.1), transparent 60%),
            var(--surface);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 36px 28px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }
        .news h2 {
          font-family: var(--display);
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .news p {
          color: #c3cad3;
          font-size: 16px;
          line-height: 1.6;
          margin: 12px auto 0;
          max-width: 440px;
        }
        .newscta {
          display: inline-block;
          margin-top: 22px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #05130b;
          font-weight: 800;
          padding: 14px 26px;
          border-radius: 14px;
          box-shadow: 0 8px 22px rgba(43, 213, 118, 0.3);
        }
        @media (prefers-reduced-motion: reduce) {
          .feat,
          .card {
            transition: none;
          }
          .pulse {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
