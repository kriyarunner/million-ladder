"use client";

import Link from "next/link";
import { type Lang, t, withLocale } from "@/lib/i18n";

export default function SiteFooter({ lang = "da" }: { lang?: Lang }) {
  const tr = t(lang).footer;
  const year = new Date().getFullYear();

  return (
    <footer className="sfoot">
      <div className="winner">
        <div className="frow">
          <Link
            className="logo"
            href={withLocale(lang, "/")}
            aria-label="Million Ladder"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <span className="mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon-192.png" alt="" aria-hidden width={40} height={40} />
            </span>
            <span className="brand">Million Ladder</span>
          </Link>

          <div className="flinks">
            <Link href={withLocale(lang, "/udfordring")}>{tr.challenge}</Link>
            <Link href={withLocale(lang, "/blog")}>{tr.guides}</Link>
            <Link href={withLocale(lang, "/simulator")}>{tr.calculator}</Link>
            <a
              href="https://www.tiktok.com/@millionladderapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
            <a
              href="https://www.instagram.com/millionladderapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <Link href={withLocale(lang, "/terms")}>{tr.terms}</Link>
            <Link href={withLocale(lang, "/privacy")}>{tr.privacy}</Link>
          </div>
        </div>

        <p className="disc">
          {tr.tagline} © {year} Million Ladder.
        </p>
      </div>

      <style jsx>{`
        .sfoot {
          width: 100%;
          border-top: 1px solid var(--line);
          padding: 34px 0;
          margin-top: 40px;
          color: var(--muted);
          font-size: 13.5px;
          text-align: left;
        }
        .winner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 22px;
        }
        .frow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .mark {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 6px 18px rgba(255, 207, 74, 0.22);
        }
        .mark img {
          width: 100%;
          height: 100%;
          display: block;
          transform: scale(1.1);
        }
        .brand {
          font-weight: 800;
          font-size: 17px;
          letter-spacing: -0.01em;
          color: #fff;
          white-space: nowrap;
        }
        .flinks {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          align-items: center;
        }
        .flinks :global(a) {
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s ease;
        }
        .flinks :global(a:hover) {
          color: #fff;
        }
        .disc {
          margin-top: 18px;
          max-width: 640px;
          opacity: 0.75;
          line-height: 1.5;
          font-size: 12.5px;
        }
      `}</style>
    </footer>
  );
}
