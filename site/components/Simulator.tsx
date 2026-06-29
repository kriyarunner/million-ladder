"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import { type Lang, t, withLocale } from "@/lib/i18n";
import { formatMoney } from "@/lib/currency";
import { useCurrency } from "./CurrencyProvider";

const MILESTONE_VALUES = [1000, 10000, 100000, 1000000];

// Antal handler for at gå fra start til mål med en gennemsnitlig vækst per handel.
function handlerTil(start: number, goal: number, ratePct: number): number {
  if (start <= 0) return Infinity;
  if (start >= goal) return 0;
  const r = 1 + ratePct / 100;
  if (r <= 1) return Infinity;
  return Math.ceil(Math.log(goal / start) / Math.log(r));
}

export default function Simulator({ lang = "da" }: { lang?: Lang }) {
  const tr = t(lang).simulator;
  const { currency } = useCurrency();
  const money = (n: number) => formatMoney(n, currency);
  const [start, setStart] = useState(100);
  const [rate, setRate] = useState(50);
  const [shared, setShared] = useState(false);

  const toMillion = useMemo(
    () => handlerTil(start, 1000000, rate),
    [start, rate]
  );

  const rows = useMemo(
    () =>
      MILESTONE_VALUES.map((v) => ({
        v,
        label: money(v),
        n: handlerTil(start, v, rate),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [start, rate, currency]
  );

  const reachable = Number.isFinite(toMillion);

  async function share() {
    const text = reachable
      ? tr.shareOk.replace("{n}", String(toMillion))
      : tr.shareNo;
    const url = `https://millionladder.com${withLocale(lang, "/simulator")}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Million Ladder", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      // bruger annullerede – ignorér
    }
  }

  return (
    <>
      <SiteNav active="simulator" lang={lang} />
      <div className="wrap">
        <header className="head">
          <span className="eyebrow">{tr.eyebrow}</span>
          <h1>{tr.h1}</h1>
          <p className="sub">{tr.sub}</p>
        </header>

        <section className="panel">
          <div className="ctrl">
            <div className="clabel">
              <span>{tr.startLabel}</span>
              <b>{money(start)}</b>
            </div>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
              aria-label={tr.startAria}
            />
            <span className="hint">{tr.startHint}</span>
          </div>

          <div className="ctrl">
            <div className="clabel">
              <span>{tr.growthLabel}</span>
              <b>+{rate}%</b>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              aria-label={tr.growthAria}
            />
            <span className="hint">{tr.growthHint}</span>
          </div>
        </section>

        <section className="result">
          <span className="rlabel">{tr.resultLabel}</span>
          <div className="rbig">
            {reachable ? toMillion : "—"}
            <span className="runit">{tr.resultUnit}</span>
          </div>
          <p className="rsub">
            {reachable ? tr.resultSubOk : tr.resultSubNo}
          </p>
        </section>

        <section className="steps">
          <h2>{tr.stepsH2}</h2>
          <div className="rows">
            {rows.map((m) => (
              <div className="srow" key={m.v}>
                <span className="sgoal">{m.label}</span>
                <div className="sbar">
                  <i
                    style={{
                      width: reachable
                        ? `${Math.min(
                            100,
                            (m.n / Math.max(1, toMillion)) * 100
                          )}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="scount">
                  {Number.isFinite(m.n) ? `${m.n} ${tr.rowUnit}` : "—"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="actions">
          <button type="button" className="cta" onClick={share}>
            {shared ? tr.shareCopied : tr.shareBtn}
          </button>
          <Link href={withLocale(lang, "/udfordring")} className="ghost">
            {tr.startChallenge}
          </Link>
        </div>

        <p className="disc">{tr.disc}</p>

      </div>

      <SiteFooter lang={lang} />

      <style jsx>{`
        .wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: 40px 22px 80px;
        }
        .eyebrow {
          display: inline-block;
          color: var(--gold);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        h1 {
          font-family: var(--display);
          font-size: clamp(30px, 5.5vw, 48px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.06;
          margin: 14px 0 0;
        }
        .sub {
          color: #c3cad3;
          font-size: 17px;
          line-height: 1.6;
          margin-top: 18px;
        }
        .panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 32px;
        }
        @media (max-width: 600px) {
          .panel {
            grid-template-columns: 1fr;
          }
        }
        .ctrl {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.24);
        }
        .clabel {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
        }
        .clabel span {
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
        }
        .clabel b {
          font-family: var(--display);
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        input[type="range"] {
          width: 100%;
          margin: 16px 0 10px;
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--accent), var(--accent-light));
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--accent);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--accent);
          cursor: pointer;
        }
        .hint {
          color: var(--muted);
          font-size: 12.5px;
          line-height: 1.45;
          display: block;
        }
        .result {
          margin-top: 18px;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(255, 207, 74, 0.12), transparent 65%),
            linear-gradient(160deg, var(--surface), var(--bg));
          border: 1px solid rgba(255, 207, 74, 0.25);
          border-radius: 22px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .rlabel {
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .rbig {
          font-family: var(--display);
          font-size: clamp(54px, 12vw, 84px);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-top: 8px;
          background: linear-gradient(120deg, var(--accent), var(--accent-light));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .runit {
          font-size: 24px;
          color: var(--muted);
          -webkit-text-fill-color: var(--muted);
        }
        .rsub {
          color: #c3cad3;
          font-size: 15px;
          margin-top: 12px;
        }
        .steps {
          margin-top: 32px;
        }
        .steps h2 {
          font-family: var(--display);
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .rows {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .srow {
          display: grid;
          grid-template-columns: 96px 1fr 86px;
          align-items: center;
          gap: 12px;
        }
        @media (max-width: 480px) {
          .srow {
            grid-template-columns: 78px 1fr 70px;
            gap: 8px;
          }
        }
        .sgoal {
          font-weight: 800;
          font-size: 14px;
        }
        .sbar {
          height: 12px;
          background: var(--surface2);
          border: 1px solid var(--line);
          border-radius: 99px;
          overflow: hidden;
        }
        .sbar i {
          display: block;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1fa863, var(--accent) 55%, var(--accent-light));
          transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .scount {
          text-align: right;
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }
        .actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 30px;
        }
        .cta {
          flex: 1;
          min-width: 180px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #05130b;
          border: none;
          font-family: inherit;
          font-weight: 800;
          font-size: 15px;
          padding: 15px 24px;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(43, 213, 118, 0.3);
          transition: transform 0.1s ease;
        }
        .cta:active {
          transform: scale(0.98);
        }
        .ghost {
          flex: 1;
          min-width: 180px;
          text-align: center;
          background: var(--surface2);
          border: 1px solid var(--line);
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          padding: 15px 24px;
          border-radius: 14px;
        }
        .ghost:hover {
          border-color: #3a414c;
        }
        .disc {
          margin-top: 24px;
          color: var(--muted);
          font-size: 12.5px;
          line-height: 1.55;
          opacity: 0.8;
        }
        footer {
          margin-top: 34px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 13.5px;
          text-align: center;
        }
        footer :global(a) {
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        footer :global(a:hover) {
          color: #fff;
        }
        @media (prefers-reduced-motion: reduce) {
          .sbar i {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
