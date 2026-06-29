"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "./CurrencyProvider";
import type { Lang } from "@/lib/i18n";

export default function CurrencySwitcher({
  lang = "da",
  onPick,
}: {
  lang?: Lang;
  onPick?: () => void;
}) {
  const { currency, setCurrencyCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = lang === "en" ? "Currency" : "Valuta";

  return (
    <div className="ccy" ref={ref}>
      <button
        type="button"
        className="ccy-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flag" aria-hidden>
          {currency.flag}
        </span>
        <span className="code">{currency.code}</span>
        <svg className="chev" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul className="ccy-menu" role="listbox" aria-label={label}>
          {CURRENCIES.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === currency.code}
                className={c.code === currency.code ? "on" : ""}
                onClick={() => {
                  setCurrencyCode(c.code);
                  setOpen(false);
                  onPick?.();
                }}
              >
                <span className="flag" aria-hidden>
                  {c.flag}
                </span>
                <span className="nm">{c.name[lang]}</span>
                <span className="cd">{c.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .ccy {
          position: relative;
        }
        .ccy-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid var(--line);
          border-radius: 99px;
          padding: 6px 11px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: var(--muted);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          font-family: inherit;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .ccy-btn:hover {
          color: #fff;
          border-color: var(--muted);
        }
        .ccy-btn .flag {
          font-size: 14px;
          line-height: 1;
        }
        .ccy-btn .chev {
          width: 13px;
          height: 13px;
          opacity: 0.7;
          transition: transform 0.18s ease;
        }
        .ccy-btn[aria-expanded="true"] .chev {
          transform: rotate(180deg);
        }
        .ccy-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 200;
          min-width: 220px;
          max-height: 320px;
          overflow-y: auto;
          list-style: none;
          margin: 0;
          padding: 6px;
          background: #0a0e14;
          border: 1px solid var(--line);
          border-radius: 14px;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55);
        }
        .ccy-menu li {
          margin: 0;
        }
        .ccy-menu button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 10px;
          border: none;
          background: transparent;
          border-radius: 9px;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          color: #e8ecf1;
          text-align: left;
          transition: background 0.12s ease;
        }
        .ccy-menu button:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .ccy-menu button.on {
          background: rgba(43, 213, 118, 0.1);
          color: #fff;
        }
        .ccy-menu .flag {
          font-size: 17px;
          line-height: 1;
          flex-shrink: 0;
        }
        .ccy-menu .nm {
          flex: 1;
          font-weight: 600;
        }
        .ccy-menu .cd {
          color: var(--muted);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.02em;
        }
        .ccy-menu button.on .cd {
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
