"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import { type Lang, t, withLocale } from "@/lib/i18n";
import { getWeeks, resetConfirm } from "@/lib/challenge";
import { useSignupModal } from "./SignupModal";

const TOTAL = 37;
const STORAGE_KEY = "ml_challenge_done_v1";

export default function Challenge({ lang = "da" }: { lang?: Lang }) {
  const tr = t(lang).challenge;
  const { open: openSignup } = useSignupModal();
  const WEEKS = getWeeks(lang);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as number[];
        setDone(new Set(arr));
      }
    } catch {
      // ignorér – starter bare forfra
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
    } catch {
      // ignorér
    }
  }, [done, loaded]);

  const count = done.size;
  const pct = Math.round((count / TOTAL) * 100);
  const nextDay = useMemo(() => {
    for (let i = 1; i <= TOTAL; i++) if (!done.has(i)) return i;
    return TOTAL;
  }, [done]);

  function toggle(d: number) {
    setDone((prev) => {
      const n = new Set(prev);
      if (n.has(d)) n.delete(d);
      else n.add(d);
      return n;
    });
  }

  function reset() {
    if (confirm(resetConfirm[lang])) {
      setDone(new Set());
    }
  }

  return (
    <>
      <SiteNav active="udfordring" lang={lang} />
      <div className="wrap">
        <header className="head">
          <span className="eyebrow">{tr.eyebrow}</span>
          <h1>{tr.h1}</h1>
          <p className="sub">{tr.sub}</p>

          <div className="how">
            {tr.how.map((h, i) => (
              <div className="howcard" key={i}>
                <span className="hn">{i + 1}</span>
                <p>{h}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="tracker" aria-live="polite">
          <div className="tline">
            <span className="tbig">
              {loaded ? count : 0}
              <span className="tslash"> / {TOTAL}</span>
            </span>
            <span className="tmeta">
              {count >= TOTAL ? tr.doneAll : `${tr.next} ${nextDay}`}
            </span>
          </div>
          <div className="tbar">
            <i style={{ width: `${loaded ? pct : 0}%` }} />
          </div>
          <div className="trow">
            <span className="tpct">
              {loaded ? pct : 0}
              {tr.pctDone}
            </span>
            {count > 0 && (
              <button className="reset" onClick={reset} type="button">
                {tr.reset}
              </button>
            )}
          </div>
        </section>

        {WEEKS.map((w) => {
          const wDone = w.days.filter((day) => done.has(day.d)).length;
          return (
            <section className="week" key={w.n}>
              <div className="whead">
                <div>
                  <span className="wlabel">
                    {tr.weekLabel} {w.n}
                  </span>
                  <h2>{w.focus}</h2>
                </div>
                <span className="wprog">
                  {wDone}/{w.days.length}
                </span>
              </div>
              <p className="wintro">{w.intro}</p>
              <div className="days">
                {w.days.map((day) => {
                  const isDone = done.has(day.d);
                  const isNext = day.d === nextDay && !isDone;
                  return (
                    <button
                      key={day.d}
                      type="button"
                      className={`day${isDone ? " done" : ""}${
                        isNext ? " next" : ""
                      }`}
                      onClick={() => toggle(day.d)}
                      aria-pressed={isDone}
                    >
                      <span className="check" aria-hidden>
                        {isDone ? "✓" : ""}
                      </span>
                      <span className="dbody">
                        <span className="dtop">
                          <span className="dnum">
                            {tr.dayLabel} {day.d}
                          </span>
                          {isNext && <span className="dnext">{tr.yourTurn}</span>}
                        </span>
                        <span className="dtitle">{day.title}</span>
                        <span className="dtask">{day.task}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="end">
          <h2>{tr.endH2}</h2>
          <p>{tr.endP}</p>
          <Link
            href={withLocale(lang, "/#download")}
            className="cta"
            onClick={(e) => {
              e.preventDefault();
              openSignup();
            }}
          >
            {tr.endCta}
          </Link>
        </section>

      </div>

      <SiteFooter lang={lang} />

      <style jsx>{`
        .wrap {
          max-width: 760px;
          margin: 0 auto;
          padding: 40px 22px 80px;
        }
        .eyebrow {
          display: inline-block;
          color: var(--accent);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        h1 {
          font-family: var(--display);
          font-size: clamp(32px, 6vw, 52px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin: 14px 0 0;
        }
        .sub {
          color: #c3cad3;
          font-size: 17px;
          line-height: 1.6;
          margin-top: 18px;
        }
        .how {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 28px;
        }
        @media (max-width: 640px) {
          .how {
            grid-template-columns: 1fr;
          }
        }
        .howcard {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.24);
        }
        .hn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--surface2);
          border: 1px solid var(--line);
          color: var(--accent);
          font-weight: 800;
          font-size: 14px;
        }
        .howcard p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.55;
          margin-top: 10px;
        }
        .tracker {
          position: sticky;
          top: 74px;
          z-index: 5;
          margin-top: 30px;
          background: linear-gradient(160deg, var(--surface), var(--bg));
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }
        .tline {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .tbig {
          font-family: var(--display);
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .tslash {
          color: var(--muted);
          font-size: 22px;
        }
        .tmeta {
          color: var(--gold);
          font-weight: 700;
          font-size: 14px;
        }
        .tbar {
          height: 14px;
          background: var(--surface2);
          border: 1px solid var(--line);
          border-radius: 99px;
          overflow: hidden;
          margin: 14px 0 10px;
          box-shadow: 0 0 12px rgba(43, 213, 118, 0.25);
        }
        .tbar i {
          display: block;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1fa863, var(--accent) 55%, var(--accent-light));
          transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .trow {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tpct {
          color: var(--muted);
          font-size: 13px;
          font-weight: 600;
        }
        .reset {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 13px;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
          font-family: inherit;
        }
        .reset:hover {
          color: #fff;
        }
        .week {
          margin-top: 40px;
        }
        .whead {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 12px;
        }
        .wlabel {
          color: var(--accent);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .whead h2 {
          font-family: var(--display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-top: 4px;
        }
        .wprog {
          color: var(--muted);
          font-weight: 800;
          font-size: 15px;
          white-space: nowrap;
        }
        .wintro {
          color: #c3cad3;
          font-size: 15px;
          line-height: 1.6;
          margin-top: 14px;
        }
        .days {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
        }
        .day {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          width: 100%;
          text-align: left;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          font-family: inherit;
          color: var(--txt);
          transition: border-color 0.15s ease, transform 0.08s ease,
            background 0.15s ease;
        }
        .day:hover {
          border-color: #3a414c;
        }
        .day:active {
          transform: scale(0.992);
        }
        .day.next {
          border-color: rgba(255, 207, 74, 0.4);
          background: linear-gradient(160deg, rgba(255, 207, 74, 0.06), var(--surface));
        }
        .day.done {
          background: #0c1a12;
          border-color: var(--accentDim);
        }
        .check {
          flex: 0 0 auto;
          width: 26px;
          height: 26px;
          border-radius: 8px;
          border: 2px solid #2c313a;
          background: var(--surface2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #05130b;
          font-weight: 900;
          font-size: 15px;
          margin-top: 2px;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .day.done .check {
          background: var(--accent);
          border-color: var(--accent);
        }
        .dbody {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .dtop {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dnum {
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .dnext {
          color: #05130b;
          background: var(--gold);
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .dtitle {
          font-size: 16.5px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .day.done .dtitle {
          color: #9bdcb6;
        }
        .dtask {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.5;
        }
        .end {
          margin-top: 52px;
          background: radial-gradient(circle at 50% 0%, rgba(255, 207, 74, 0.1), transparent 60%),
            var(--surface);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }
        .end h2 {
          font-family: var(--display);
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .end p {
          color: #c3cad3;
          font-size: 16px;
          line-height: 1.6;
          margin: 14px auto 0;
          max-width: 480px;
        }
        .cta {
          display: inline-block;
          margin-top: 22px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #05130b;
          font-weight: 800;
          padding: 14px 26px;
          border-radius: 14px;
          box-shadow: 0 8px 22px rgba(43, 213, 118, 0.3);
        }
        footer {
          margin-top: 44px;
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
        .disc {
          margin-top: 14px;
          opacity: 0.75;
          line-height: 1.5;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (prefers-reduced-motion: reduce) {
          .tbar i,
          .day,
          .check {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
