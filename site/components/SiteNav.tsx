"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type Lang, t, withLocale, stripLocale } from "@/lib/i18n";
import CurrencySwitcher from "./CurrencySwitcher";
import { useSignupModal } from "./SignupModal";

export default function SiteNav({
  active,
  lang = "da",
}: {
  active?: string;
  lang?: Lang;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { open: openSignup } = useSignupModal();
  const pathname = usePathname() || "/";
  const tr = t(lang).nav;
  const other: Lang = lang === "en" ? "da" : "en";
  const switchHref = withLocale(other, stripLocale(pathname));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);
  const pickLang = () => {
    document.cookie = `ml_lang=${other}; path=/; max-age=31536000; samesite=lax`;
    close();
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://millionladder.com";
    const data = { title: "Million Ladder", text: tr.shareText, url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // brugeren afbrød delingen – gør intet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard ikke tilgængelig – gør intet
    }
  };

  return (
    <nav className={`snav ${scrolled || open ? "scrolled" : ""}`}>
      <div className="inner">
        <Link
          href={withLocale(lang, "/")}
          className="logo"
          aria-label="Million Ladder"
          onClick={close}
          style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}
        >
          <span className="mark" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="" width={40} height={40} />
          </span>
          <span className="brand">Million Ladder</span>
        </Link>

        <button
          type="button"
          className={`burger ${open ? "x" : ""}`}
          aria-label={open ? "Luk menu" : "Åbn menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`links ${open ? "show" : ""}`}>
          <Link
            href={withLocale(lang, "/")}
            className={active === "home" ? "on" : ""}
            onClick={close}
          >
            {tr.home}
          </Link>
          <Link
            href={withLocale(lang, "/udfordring")}
            className={active === "udfordring" ? "on" : ""}
            onClick={close}
          >
            {tr.challenge}
          </Link>
          <Link
            href={withLocale(lang, "/blog")}
            className={`gd ${active === "blog" ? "on" : ""}`}
            onClick={close}
          >
            {tr.guides}
            <span className="nb">{tr.new}</span>
          </Link>
          <Link
            href={withLocale(lang, "/simulator")}
            className={active === "simulator" ? "on" : ""}
            onClick={close}
          >
            {tr.calculator}
          </Link>
          <CurrencySwitcher lang={lang} onPick={close} />
          <button
            type="button"
            className="shr"
            onClick={handleShare}
            aria-label={tr.share}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {copied ? tr.shareCopied : tr.share}
          </button>
          <Link
            href={switchHref}
            className="lng"
            onClick={pickLang}
            aria-label={tr.switchAria}
          >
            {tr.switchTo}
          </Link>
          <Link
            href={withLocale(lang, "/#download")}
            className="cta"
            onClick={(e) => {
              e.preventDefault();
              close();
              openSignup();
            }}
          >
            {tr.cta}
          </Link>
        </div>
      </div>

      <style jsx>{`
        .snav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: transparent;
          border-bottom: 1px solid transparent;
          backdrop-filter: blur(0px);
          transition: background 0.3s ease, border-color 0.3s ease,
            backdrop-filter 0.3s ease, box-shadow 0.3s ease;
        }
        .snav.scrolled {
          background: rgba(7, 9, 12, 0.82);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(16px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
        }
        .inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 22px;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .logo {
          display: inline-flex;
          align-items: center;
          font-weight: 800;
          font-size: 17px;
          letter-spacing: -0.01em;
          color: #fff;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.15s ease;
        }
        .logo:hover {
          opacity: 0.85;
        }
        .mark {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(255, 207, 74, 0.22);
          flex-shrink: 0;
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
        .links {
          display: flex;
          align-items: center;
          gap: 28px;
          font-size: 14.5px;
          font-weight: 600;
        }
        .links :global(a) {
          color: var(--muted);
        }
        .links :global(a:not(.cta)) {
          position: relative;
          transition: color 0.15s ease;
        }
        .links :global(a:not(.cta))::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 2px;
          border-radius: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.22s ease;
        }
        .links :global(a:not(.cta):hover) {
          color: #fff;
        }
        .links :global(a:not(.cta):hover)::after,
        .links :global(a.on)::after {
          transform: scaleX(1);
        }
        .links :global(a.on) {
          color: #fff;
        }
        .links :global(a.gd) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .links :global(a.gd .nb) {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(255, 207, 74, 0.12);
          border: 1px solid rgba(255, 207, 74, 0.3);
          padding: 1px 6px;
          border-radius: 99px;
          line-height: 1.5;
        }
        .links :global(a.cta) {
          color: #05130b;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          padding: 9px 18px;
          border-radius: 99px;
          font-weight: 800;
          box-shadow: 0 6px 18px rgba(43, 213, 118, 0.25);
          transition: transform 0.12s ease, box-shadow 0.2s ease;
        }
        .links :global(a.cta:hover) {
          color: #05130b;
          box-shadow: 0 10px 26px rgba(43, 213, 118, 0.35);
        }
        .links :global(a.cta:active) {
          transform: scale(0.96);
        }
        .links :global(a.lng) {
          border: 1px solid var(--line);
          border-radius: 99px;
          padding: 6px 13px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: var(--muted);
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .links :global(a.lng::after) {
          display: none;
        }
        .links :global(a.lng:hover) {
          color: #fff;
          border-color: var(--muted);
        }
        .links :global(button.shr) {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid var(--line);
          border-radius: 99px;
          padding: 6px 13px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: var(--muted);
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .links :global(button.shr:hover) {
          color: #fff;
          border-color: var(--muted);
        }
        .links :global(button.shr svg) {
          flex-shrink: 0;
        }

        .burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 42px;
          height: 42px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          padding: 0 11px;
        }
        .burger span {
          display: block;
          height: 2px;
          width: 100%;
          background: #fff;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }
        .burger.x span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .burger.x span:nth-child(2) {
          opacity: 0;
        }
        .burger.x span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        @media (max-width: 720px) {
          .burger {
            display: flex;
          }
          .links {
            position: absolute;
            top: 66px;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
            padding: 14px 18px 20px;
            background: #0a0e14;
            border-bottom: 1px solid var(--line);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
            transition: opacity 0.22s ease, transform 0.22s ease;
          }
          .links.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
          .links :global(a) {
            color: #e8ecf1;
            font-size: 16px;
            font-weight: 600;
            padding: 13px 12px;
            border-radius: 12px;
          }
          .links :global(a:not(.cta))::after {
            display: none;
          }
          .links :global(a:not(.cta):hover),
          .links :global(a:active) {
            background: rgba(255, 255, 255, 0.05);
          }
          .links :global(a.on) {
            color: var(--accent);
            background: rgba(43, 213, 118, 0.08);
          }
          .links :global(a.cta) {
            text-align: center;
            margin-top: 8px;
            padding: 14px 18px;
            color: #05130b;
          }
          .links :global(a.lng) {
            align-self: flex-start;
            margin-top: 6px;
            padding: 8px 14px;
          }
          .links :global(button.shr) {
            align-self: flex-start;
            margin-top: 6px;
            padding: 11px 16px;
            font-size: 15px;
          }
        }
      `}</style>
    </nav>
  );
}
