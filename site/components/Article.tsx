"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import SignupInline from "./SignupInline";
import BackToTop from "./BackToTop";
import { formatDate, getPosts, type Post } from "@/lib/posts";
import { type Lang, t, withLocale } from "@/lib/i18n";
import { useSignupModal } from "./SignupModal";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Article({
  post,
  lang = "da",
}: {
  post: Post;
  lang?: Lang;
}) {
  const tr = t(lang).article;
  const { open: openSignup } = useSignupModal();
  const headings = post.body
    .filter((b) => b.t === "h2")
    .map((b) => ({ id: slugify((b as { c: string }).c), text: (b as { c: string }).c }));

  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);

  const url = `https://millionladder.com${withLocale(lang, `/blog/${post.slug}`)}`;
  const related = getPosts(lang)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  useEffect(() => {
    function onScroll() {
      const el = artRef.current;
      if (!el) return;
      const start = el.offsetTop;
      const span = el.offsetHeight - window.innerHeight;
      const p = span > 0 ? (window.scrollY - start) / span : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.slug]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignorér */
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    post.title
  )}&url=${encodeURIComponent(url)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;

  return (
    <>
      <SiteNav active="blog" lang={lang} />
      <BackToTop lang={lang} />
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />

      <div className="shell">
        <article ref={artRef}>
          <nav className="crumbs" aria-label="Sti">
            <Link href={withLocale(lang, "/")}>{tr.crumbHome}</Link>
            <span>/</span>
            <Link href={withLocale(lang, "/blog")}>{tr.crumbGuides}</Link>
            <span>/</span>
            <span className="cur">{post.tag}</span>
          </nav>

          <span className="tag">{post.tag}</span>
          <h1>{post.title}</h1>
          <p className="lead-ex">{post.excerpt}</p>

          <div className="byline">
            <span className="avatar" aria-hidden>
              M
            </span>
            <div>
              <div className="bname">Million Ladder</div>
              <div className="bmeta">
                {formatDate(post.date, lang)} · {post.read} {tr.reading}
              </div>
            </div>
          </div>

          <div className="body">
            {post.body.map((b, i) => {
              const block =
                b.t === "h2" ? (
                  <h2 id={slugify(b.c)} key={i}>
                    {b.c}
                  </h2>
                ) : b.t === "quote" ? (
                  <blockquote key={i}>{b.c}</blockquote>
                ) : b.t === "ul" ? (
                  <ul key={i}>
                    {b.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{b.c}</p>
                );
              // Content upgrade lige efter introen — den højest-konverterende placering.
              if (i === 0) {
                return (
                  <div key="intro-block">
                    {block}
                    <SignupInline
                      heading={tr.upgradeH}
                      sub={tr.upgradeSub}
                      button={tr.upgradeBtn}
                      lang={lang}
                    />
                  </div>
                );
              }
              return block;
            })}
          </div>

          <div className="sharerow">
            <span>{tr.share}</span>
            <div className="sbtns">
              <button type="button" onClick={copyLink} className="sb">
                {copied ? tr.copied : tr.copy}
              </button>
              <a
                className="sb"
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              <a
                className="sb"
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>

          <div className="cta">
            <h3>{tr.ctaH}</h3>
            <p>{tr.ctaP}</p>
            <div className="ctab">
              <Link href={withLocale(lang, "/udfordring")} className="primary">
                {tr.ctaPrimary}
              </Link>
              <Link
                href={withLocale(lang, "/#download")}
                className="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  openSignup();
                }}
              >
                {tr.ctaGhost}
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <section className="related">
              <h3>{tr.related}</h3>
              <div className="rgrid">
                {related.map((p) => (
                  <Link
                    href={withLocale(lang, `/blog/${p.slug}`)}
                    key={p.slug}
                    className="rcard"
                  >
                    <span className="rtag">{p.tag}</span>
                    <span className="rtitle">{p.title}</span>
                    <span className="rmeta">
                      {p.read} {tr.reading}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </article>

        {headings.length > 1 && (
          <aside className="toc">
            <div className="tocinner">
              <span className="toclabel">{tr.onThisPage}</span>
              <ul>
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className={activeId === h.id ? "on" : ""}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      <SiteFooter lang={lang} />

      <style jsx>{`
        .progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent-light));
          transform-origin: 0 50%;
          z-index: 200;
        }
        .shell {
          max-width: 1060px;
          margin: 0 auto;
          padding: 44px 22px 80px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
        }
        @media (min-width: 1024px) {
          .shell {
            grid-template-columns: minmax(0, 1fr) 232px;
            align-items: start;
          }
        }
        article {
          max-width: 720px;
          width: 100%;
        }
        .crumbs {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          color: var(--muted);
        }
        .crumbs :global(a:hover) {
          color: #fff;
        }
        .crumbs .cur {
          color: var(--accent);
        }
        .tag {
          display: inline-block;
          margin-top: 22px;
          color: var(--accent);
          background: rgba(43, 213, 118, 0.1);
          border: 1px solid rgba(43, 213, 118, 0.22);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 99px;
        }
        h1 {
          font-family: var(--display);
          font-size: clamp(32px, 5.2vw, 50px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.06;
          margin: 18px 0 0;
        }
        .lead-ex {
          color: #aeb6c0;
          font-size: 20px;
          line-height: 1.55;
          margin-top: 18px;
        }
        .byline {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 26px;
          padding-bottom: 26px;
          border-bottom: 1px solid var(--line);
        }
        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2bd576, #1fa863);
          color: var(--gold);
          font-weight: 800;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bname {
          font-weight: 800;
          font-size: 14.5px;
        }
        .bmeta {
          color: var(--muted);
          font-size: 13px;
          margin-top: 2px;
        }
        .body {
          margin-top: 12px;
        }
        .body :global(p) {
          color: #d7dde4;
          font-size: 19px;
          line-height: 1.75;
          margin-top: 22px;
        }
        .body :global(p:first-child)::first-letter {
          font-family: var(--display);
          font-size: 64px;
          font-weight: 700;
          float: left;
          line-height: 0.82;
          padding: 6px 12px 0 0;
          color: var(--accent);
        }
        .body :global(h2) {
          font-family: var(--display);
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-top: 44px;
          scroll-margin-top: 84px;
          color: #fff;
        }
        .body :global(ul) {
          margin: 22px 0 0;
          padding: 0;
          list-style: none;
        }
        .body :global(li) {
          position: relative;
          color: #d7dde4;
          font-size: 18px;
          line-height: 1.65;
          padding-left: 30px;
          margin-top: 12px;
        }
        .body :global(li)::before {
          content: "↗";
          position: absolute;
          left: 0;
          top: 1px;
          color: var(--accent);
          font-weight: 800;
        }
        .body :global(blockquote) {
          margin: 34px 0 0;
          padding: 22px 26px;
          border-left: 3px solid var(--gold);
          background: rgba(255, 207, 74, 0.07);
          border-radius: 0 16px 16px 0;
          font-family: var(--display);
          font-size: 22px;
          font-weight: 600;
          line-height: 1.45;
          color: #fff;
        }
        .sharerow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 44px;
          padding-top: 24px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 14px;
          font-weight: 700;
        }
        .sbtns {
          display: flex;
          gap: 10px;
        }
        .sb {
          background: var(--surface2);
          border: 1px solid var(--line);
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          padding: 9px 15px;
          border-radius: 99px;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s ease;
        }
        .sb:hover {
          border-color: var(--accent);
        }
        .cta {
          margin-top: 40px;
          background: radial-gradient(circle at 50% 0%, rgba(43, 213, 118, 0.1), transparent 60%),
            var(--surface);
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }
        .cta h3 {
          font-family: var(--display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .cta p {
          color: #c3cad3;
          font-size: 15.5px;
          line-height: 1.6;
          margin: 12px auto 0;
          max-width: 420px;
        }
        .ctab {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 22px;
        }
        .primary {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #05130b;
          font-weight: 800;
          padding: 13px 24px;
          border-radius: 13px;
          box-shadow: 0 8px 22px rgba(43, 213, 118, 0.3);
        }
        .ghost {
          background: var(--surface2);
          border: 1px solid var(--line);
          color: #fff;
          font-weight: 700;
          padding: 13px 24px;
          border-radius: 13px;
        }
        .ghost:hover {
          border-color: #3a414c;
        }
        .related {
          margin-top: 48px;
        }
        .related h3 {
          font-family: var(--display);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .rgrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 16px;
        }
        @media (max-width: 560px) {
          .rgrid {
            grid-template-columns: 1fr;
          }
        }
        .rcard {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 18px;
          transition: border-color 0.15s ease, transform 0.12s ease;
        }
        .rcard:hover {
          border-color: #3a414c;
          transform: translateY(-2px);
        }
        .rtag {
          align-self: flex-start;
          color: var(--accent);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .rtitle {
          font-family: var(--display);
          font-weight: 700;
          font-size: 16px;
          line-height: 1.25;
          color: #fff;
        }
        .rmeta {
          color: var(--muted);
          font-size: 12.5px;
        }
        footer {
          margin-top: 44px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 13.5px;
        }
        footer :global(a) {
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        footer :global(a:hover) {
          color: #fff;
        }
        .disc {
          margin-top: 14px;
          opacity: 0.75;
          line-height: 1.5;
          max-width: 560px;
        }
        .toc {
          display: none;
        }
        @media (min-width: 1024px) {
          .toc {
            display: block;
          }
        }
        .tocinner {
          position: sticky;
          top: 84px;
        }
        .toclabel {
          display: block;
          color: var(--muted);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .toc ul {
          list-style: none;
          margin: 0;
          padding: 0;
          border-left: 2px solid var(--line);
        }
        .toc li {
          margin: 0;
        }
        .toc :global(a) {
          display: block;
          color: var(--muted);
          font-size: 13.5px;
          line-height: 1.4;
          padding: 7px 0 7px 16px;
          margin-left: -2px;
          border-left: 2px solid transparent;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .toc :global(a:hover) {
          color: #fff;
        }
        .toc :global(a.on) {
          color: var(--accent);
          border-left-color: var(--accent);
          font-weight: 700;
        }
        @media (prefers-reduced-motion: reduce) {
          .rcard {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
