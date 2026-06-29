"use client";

import { useEffect, useState } from "react";
import { type Lang, t } from "@/lib/i18n";

export default function BackToTop({ lang = "da" }: { lang?: Lang }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`btt ${show ? "show" : ""}`}
      aria-label={t(lang).backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 5l-7 7m7-7l7 7m-7-7v14"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <style jsx>{`
        .btt {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 120;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: rgba(7, 9, 12, 0.82);
          backdrop-filter: blur(12px);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          opacity: 0;
          transform: translateY(14px) scale(0.9);
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease,
            border-color 0.15s ease;
        }
        .btt.show {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .btt:hover {
          border-color: var(--accent);
        }
        .btt:active {
          transform: scale(0.92);
        }
        .btt svg {
          width: 20px;
          height: 20px;
        }
        @media (prefers-reduced-motion: reduce) {
          .btt {
            transition: opacity 0.2s ease;
            transform: none;
          }
          .btt.show {
            transform: none;
          }
        }
      `}</style>
    </button>
  );
}
