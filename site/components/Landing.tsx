"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CoinFall from "./CoinFall";
import CountUp from "./CountUp";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import { getPosts, upcomingByLang } from "@/lib/posts";
import { type Lang, t, withLocale } from "@/lib/i18n";
import { formatMoney, formatNum } from "@/lib/currency";
import { useCurrency } from "./CurrencyProvider";
import { useSignupModal } from "./SignupModal";

export default function Landing({ lang = "da" }: { lang?: Lang }) {
  const tr = t(lang).landing;
  const upcoming = upcomingByLang[lang];
  const locale = lang === "en" ? "en-US" : "da-DK";
  const { currency } = useCurrency();
  const { open: openSignup } = useSignupModal();
  const nf = (n: number) => formatNum(n, currency);
  const money = (n: number) => formatMoney(n, currency);
  const rootRef = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const latest = [...getPosts(lang)]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 2);

  useEffect(() => {
    let alive = true;
    fetch("/api/count")
      .then((r) => r.json())
      .then((d) => {
        if (alive && typeof d?.count === "number") setCount(d.count);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bar = root.querySelector("#phbar") as HTMLElement | null;
    if (bar) requestAnimationFrame(() => (bar.style.width = "36%"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="site" ref={rootRef}>
      <div className="glow" />

      <SiteNav active="home" lang={lang} />

      <header>
        <CoinFall variant="absolute" />
        <div className="wrap hero">
          <div>
            <span className="eyebrow">
              <span className="dot" /> {tr.heroEyebrow}
            </span>
            <h1>
              {tr.h1Pre}
              <span className="num">{tr.h1Num0}</span> {tr.h1Mid}
              <span className="num">{money(1000000)}</span>
              <br />
              {tr.h1Post}
            </h1>
            <p className="lead">
              {tr.lead0}
              <b>{tr.leadStrong}</b>
              {tr.lead1}
            </p>
            <div className="ctas" id="download">
              <a
                className="store"
                href="#download"
                aria-label={tr.storeApple1}
                onClick={(e) => {
                  e.preventDefault();
                  openSignup();
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.36 1.43c.07 1.02-.32 2.03-.96 2.77-.66.78-1.74 1.38-2.79 1.3-.09-1 .39-2.04 1-2.72.68-.78 1.86-1.36 2.75-1.35zM20.4 17.1c-.5 1.16-.74 1.67-1.39 2.69-.9 1.42-2.18 3.2-3.76 3.21-1.4.02-1.77-.92-3.67-.9-1.9.01-2.3.92-3.71.9-1.58-.01-2.79-1.6-3.7-3.02C1.7 16.06 1.43 11.4 3 8.96c1.1-1.73 2.85-2.74 4.49-2.74 1.67 0 2.72.92 4.1.92 1.34 0 2.16-.92 4.09-.92 1.46 0 3 .8 4.1 2.17-3.6 1.97-3.02 7.1.62 8.71z" />
                </svg>
                <span>
                  <small>{tr.storeApple0}</small>
                  {tr.storeApple1}
                </span>
              </a>
              <a
                className="store"
                href="#download"
                aria-label={tr.storeGoogle1}
                onClick={(e) => {
                  e.preventDefault();
                  openSignup();
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path fill="#2bd576" d="M3.6 2.3 13 11.7l-9.4 9.4c-.3-.2-.5-.6-.5-1.1V3.4c0-.5.2-.9.5-1.1z" />
                  <path fill="#ffcf4a" d="M16.5 8.8 13 11.7l2.6 2.6 3.9-2.2c.8-.5.8-1.6 0-2.1l-3-1.2z" />
                  <path fill="#fff" d="M3.6 2.3c.3-.2.7-.2 1.1 0l11.8 6.5L13 11.7 3.6 2.3z" />
                  <path fill="#8a909a" d="M13 11.7l3.5 2.6L4.7 20.8c-.4.2-.8.2-1.1 0L13 11.7z" />
                </svg>
                <span>
                  <small>{tr.storeGoogle0}</small>
                  {tr.storeGoogle1}
                </span>
              </a>
            </div>
            <div className="trustline">
              <span>
                <b>{tr.trustFreeB}</b>
                {tr.trustFree}
              </span>
              <span>
                <b>{tr.trustOfflineB}</b>
                {tr.trustOffline}
              </span>
              <span>
                <b>{tr.trustLoginB}</b>
                {tr.trustLogin}
              </span>
            </div>
            <div className="proof">
              <span className="pavatars" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              {count !== null && count >= 15 ? (
                <span>
                  {tr.proofPre}
                  <b>{count.toLocaleString(locale)}</b>
                  {tr.proofPost}
                </span>
              ) : (
                <span>{tr.proofEmpty}</span>
              )}
            </div>
          </div>

          <div className="phonewrap">
            <div className="phone">
              <div className="scr">
                <div className="ph-eyebrow">{tr.phCapital}</div>
                <div className="ph-cap">
                  {currency.prefix && (
                    <>
                      <small>{currency.symbol}</small>
                      {/[A-Za-z]/.test(currency.symbol.slice(-1)) ? " " : ""}
                    </>
                  )}
                  <CountUp
                    value={58000}
                    durationMs={1600}
                    format={(n) => nf(n)}
                  />
                  {!currency.prefix && (
                    <>
                      {" "}
                      <small>{currency.symbol}</small>
                    </>
                  )}
                </div>
                <div className="ph-sub">
                  <span className="trin">
                    {tr.phStepLabel} <b>22</b> / 37
                  </span>
                  <span className="muted">36%</span>
                </div>
                <div className="ph-bar">
                  <i id="phbar" />
                </div>
                <div className="ph-goal">
                  <div className="l">{tr.phNext}</div>
                  <div className="m">{money(64905)}</div>
                  <div className="t">
                    {tr.phGoalTag0}
                    <b>{money(6905)}</b>
                    {tr.phGoalTag1}
                  </div>
                </div>
                <div className="ph-rungs">
                  <div className="rung cur">
                    <span className="d" />
                    <span className="n">23</span>
                    <span className="a gold">{nf(64905)}</span>
                  </div>
                  <div className="rung done">
                    <span className="d" />
                    <span className="n">22</span>
                    <span className="a">{nf(54088)}</span>
                  </div>
                  <div className="rung done">
                    <span className="d" />
                    <span className="n">21</span>
                    <span className="a">{nf(45073)}</span>
                  </div>
                  <div className="rung done">
                    <span className="d" />
                    <span className="n">20</span>
                    <span className="a">{nf(37561)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* WHY 37 */}
      <section id="why">
        <div className="wrap why">
          <div className="reveal">
            <div className="kicker">{tr.whyKicker}</div>
            <h2>
              {tr.whyH2a}
              <br />
              {tr.whyH2b}
              <span className="gold">{tr.whyH2bGold}</span>
              {tr.whyH2c}
            </h2>
            <p className="section-sub">{tr.whyP0}</p>
            <p className="section-sub">{tr.whyP1}</p>
          </div>
          <div className="ladder-vis reveal">
            <div className="lv-row top">
              <span className="lv-step">{tr.lvStep} 37</span>
              <div className="lv-track">
                <i style={{ width: "100%" }} />
              </div>
              <span className="lv-amt">
                <CountUp value={1000000} durationMs={1800} format={(n) => nf(n)} />
              </span>
            </div>
            <div className="lv-row">
              <span className="lv-step">{tr.lvStep} 30</span>
              <div className="lv-track">
                <i style={{ width: "48%" }} />
              </div>
              <span className="lv-amt">
                <CountUp value={232568} durationMs={1600} format={(n) => nf(n)} />
              </span>
            </div>
            <div className="lv-row">
              <span className="lv-step">{tr.lvStep} 22</span>
              <div className="lv-track">
                <i style={{ width: "23%" }} />
              </div>
              <span className="lv-amt">
                <CountUp value={54088} durationMs={1400} format={(n) => nf(n)} />
              </span>
            </div>
            <div className="lv-row">
              <span className="lv-step">{tr.lvStep} 12</span>
              <div className="lv-track">
                <i style={{ width: "10%" }} />
              </div>
              <span className="lv-amt">
                <CountUp value={10483} durationMs={1200} format={(n) => nf(n)} />
              </span>
            </div>
            <div className="lv-row">
              <span className="lv-step">{tr.lvStep} 5</span>
              <div className="lv-track">
                <i style={{ width: "4%" }} />
              </div>
              <span className="lv-amt">
                <CountUp value={1543} durationMs={1000} format={(n) => nf(n)} />
              </span>
            </div>
            <div className="lv-row">
              <span className="lv-step">{tr.lvStep} 1</span>
              <div className="lv-track">
                <i style={{ width: "1%" }} />
              </div>
              <span className="lv-amt">
                <CountUp value={100} durationMs={800} format={(n) => nf(n)} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DREAM */}
      <section id="dream">
        <div className="wrap">
          <div className="dream reveal">
            <div className="dglow" aria-hidden />
            <div className="center">
              <div className="kicker">{tr.dreamKicker}</div>
              <h2>
                {tr.dreamH2a}
                <br />
                {tr.dreamH2b}
                <span className="gold">{tr.dreamH2bGold}</span>.
              </h2>
              <p className="section-sub center">{tr.dreamSub}</p>
            </div>
            <div className="dcards">
              {tr.dreamCards.map((c, i) => (
                <div className="dcard" key={i}>
                  <span className="de" aria-hidden>
                    {c.e}
                  </span>
                  <h4>{c.h}</h4>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
            <p className="dline">
              {tr.dreamLine0}
              <b>{tr.dreamLineB}</b>.
            </p>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how">
        <div className="wrap">
          <div className="center reveal">
            <div className="kicker">{tr.howKicker}</div>
            <h2>{tr.howH2}</h2>
            <p className="section-sub">{tr.howSub}</p>
          </div>
          <div className="steps">
            {tr.howSteps.map((s, i) => (
              <div className="step reveal" key={i}>
                <div className="no">{i + 1}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE — fed forklaring af appen */}
      <section id="app">
        <div className="wrap">
          <div className="center reveal">
            <div className="kicker">{tr.appKicker}</div>
            <h2>
              {tr.appH2a}
              <br />
              {tr.appH2b}
            </h2>
            <p className="section-sub center">{tr.appSub}</p>
          </div>

          <div className="spot reveal">
            <div className="spot-txt">
              <div className="kicker">{tr.spot1Kicker}</div>
              <h3>{tr.spot1H}</h3>
              <p>{tr.spot1P}</p>
            </div>
            <div className="spot-vis">
              <div className="mini-goal">
                <span className="l">{tr.spot1Mini}</span>
                <span className="m">{money(8735)}</span>
                <div className="mini-bar">
                  <i style={{ width: "78%" }} />
                </div>
                <span className="tag">
                  {money(935)}
                  {tr.toNextStep}
                </span>
              </div>
            </div>
          </div>

          <div className="spot rev reveal">
            <div className="spot-vis">
              <div className="mini-cap">
                <span className="l">{tr.spot2Cap}</span>
                <span className="big">{money(7800)}</span>
                <div className="mini-row">
                  <span>{tr.spot2Row1}</span>
                  <b className="up">+{money(1450)}</b>
                </div>
                <div className="mini-row">
                  <span>{tr.spot2Row2}</span>
                  <b className="up">+{money(900)}</b>
                </div>
              </div>
            </div>
            <div className="spot-txt">
              <div className="kicker">{tr.spot2Kicker}</div>
              <h3>{tr.spot2H}</h3>
              <p>{tr.spot2P}</p>
            </div>
          </div>

          <div className="spot reveal">
            <div className="spot-txt">
              <div className="kicker">{tr.spot3Kicker}</div>
              <h3>{tr.spot3H}</h3>
              <p>{tr.spot3P}</p>
            </div>
            <div className="spot-vis">
              <div className="mini-cele">
                <div className="badge-row">
                  <span className="mbadge gold">{tr.spot3Badge1}</span>
                  <span className="mbadge">{tr.spot3Badge2}</span>
                </div>
                <div className="dream">
                  <span className="l">{tr.spot3DreamL}</span>
                  <span className="m">{tr.spot3DreamM}</span>
                  <span className="t">{tr.spot3DreamT}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE */}
      <section id="challenge">
        <div className="wrap">
          <div className="challenge reveal">
            <div>
              <span className="tag">{tr.chTag}</span>
              <h2>
                {tr.chH2a}
                <br />
                {tr.chH2b}
              </h2>
              <p className="section-sub" style={{ marginTop: "14px" }}>
                {tr.chSub}
              </p>
              <div className="rules">
                {tr.chRules.map((r, i) => (
                  <div className="rule" key={i}>
                    <span className="ic">{i + 1}</span>
                    <span>
                      <b>{r.b}</b>
                      {r.t}
                    </span>
                  </div>
                ))}
              </div>
              <div className="hashtag">
                {tr.chHash0}
                <span className="accent">{tr.chHashAccent}</span>
                {tr.chHash1}
                <span className="gold">{tr.chHashGold}</span>.
              </div>
            </div>
            <div className="scard reveal">
              <div className="eb">{tr.chCardEb}</div>
              <div className="big gold">{tr.chCardBig}</div>
              <div className="sm">
                {money(54088)}
                {tr.inCapital}
              </div>
              <div className="pr">
                <i />
              </div>
              <div className="sm">{tr.chCardSm2}</div>
              <div className="wm">{tr.chCardWm}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="wrap">
          <div className="center reveal">
            <div className="kicker">{tr.featKicker}</div>
            <h2>{tr.featH2}</h2>
          </div>
          <div className="feats">
            {tr.feats.map((f, i) => (
              <div className="feat reveal" key={i}>
                <div className={`fi${i === 0 || i === 3 ? " gold" : i === 1 || i === 4 ? " accent" : ""}`}>
                  {f.i}
                </div>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog">
        <div className="wrap">
          <div className="center reveal">
            <div className="kicker">
              <span className="livedot" /> {tr.blogKicker}
            </div>
            <h2>{tr.blogH2}</h2>
            <p className="section-sub center">{tr.blogSub}</p>
          </div>
          <div className="bloggrid reveal">
            {latest.map((p) => (
              <Link
                key={p.slug}
                href={withLocale(lang, `/blog/${p.slug}`)}
                className="bcard"
              >
                <span className="btag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="bread">{tr.blogRead}</span>
              </Link>
            ))}
            <div className="bcard bteaser">
              <span className="btag gold">
                <span className="livedot gold" /> {upcoming.badge}
              </span>
              <h3>{upcoming.title}</h3>
              <p>{upcoming.teaser}</p>
              <a
                href="#download"
                className="bread gold"
                onClick={(e) => {
                  e.preventDefault();
                  openSignup();
                }}
              >
                {tr.blogNotifyFirst}
              </a>
            </div>
          </div>
          <div className="center" style={{ marginTop: "28px" }}>
            <Link href={withLocale(lang, "/blog")} className="bmore">
              {tr.blogMore}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="wrap">
          <div className="center reveal">
            <div className="kicker">{tr.faqKicker}</div>
            <h2>{tr.faqH2}</h2>
          </div>
          <div className="faq reveal">
            {tr.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="wrap">
          <div className="final reveal">
            <div className="kicker">{tr.finalKicker}</div>
            <h2>
              {tr.finalH2a}
              <br />
              {tr.finalH2b}
            </h2>
            <p className="section-sub center">
              {tr.finalSub0}
              <b>{tr.finalSubB}</b>
              {tr.finalSub1}
            </p>
            {count !== null && count >= 15 && (
              <div className="proof proofcenter">
                <span className="pavatars" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  {tr.proofPre}
                  <b>{count.toLocaleString(locale)}</b>
                  {tr.proofPost}
                </span>
              </div>
            )}
            <form
              className="signup"
              onSubmit={async (e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector("input");
                const email = input?.value.trim();
                if (!email) return;
                try {
                  const res = await fetch("/api/subscribe", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ email, lang }),
                  });
                  if (res.ok) {
                    if (input) input.value = "";
                    setOk(true);
                  }
                } catch {
                  /* ignorér */
                }
              }}
            >
              <input
                type="email"
                placeholder={tr.finalEmail}
                required
                aria-label="E-mail"
              />
              <button type="submit">{tr.finalSubmit}</button>
              {ok && <span className="ok">{tr.finalOk}</span>}
            </form>
            <p className="finehint">{tr.finalHint}</p>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} />

      <style jsx>{`
        .site {
          overflow-x: hidden;
          line-height: 1.5;
        }
        .wrap {
          max-width: var(--maxw);
          margin: 0 auto;
          padding: 0 22px;
        }
        .accent {
          color: var(--accent);
        }
        .gold {
          color: var(--gold);
        }
        .muted {
          color: var(--muted);
        }
        .glow {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }
        .glow::before {
          content: "";
          position: absolute;
          top: -180px;
          left: 50%;
          transform: translateX(-50%);
          width: 760px;
          height: 760px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43, 213, 118, 0.16), transparent 60%);
          filter: blur(20px);
        }
        .glow::after {
          content: "";
          position: absolute;
          bottom: -200px;
          right: -120px;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 207, 74, 0.08), transparent 60%);
          filter: blur(20px);
        }
        section {
          scroll-margin-top: 78px;
        }
        .logo {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          font-weight: 800;
          font-size: 17px;
          letter-spacing: -0.01em;
          color: #fff;
          text-decoration: none;
          cursor: pointer;
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
        @keyframes ctaslide {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 220% 50%;
          }
        }
        header {
          padding: 74px 0 40px;
          position: relative;
          overflow: hidden;
        }
        .hero {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 880px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 800;
          border: 1px solid rgba(255, 207, 74, 0.28);
          background: rgba(255, 207, 74, 0.07);
          padding: 7px 14px;
          border-radius: 99px;
        }
        .eyebrow .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 10px var(--gold);
          animation: blink 1.8s infinite;
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        h1 {
          font-family: var(--display);
          font-size: clamp(40px, 6.2vw, 68px);
          line-height: 1.02;
          letter-spacing: -0.035em;
          font-weight: 700;
          margin: 22px 0 0;
        }
        h1 .num {
          font-family: var(--display);
          white-space: nowrap;
          background: linear-gradient(120deg, var(--accent), var(--accent-light));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .lead {
          color: #c3cad3;
          font-size: clamp(16px, 2.1vw, 19px);
          margin-top: 20px;
          max-width: 520px;
        }
        @media (max-width: 880px) {
          .lead {
            margin-left: auto;
            margin-right: auto;
          }
        }
        .lead b {
          color: #fff;
          font-weight: 700;
        }
        .ctas {
          display: flex;
          gap: 14px;
          margin-top: 30px;
          flex-wrap: wrap;
        }
        @media (max-width: 880px) {
          .ctas {
            justify-content: center;
          }
        }
        .store {
          display: flex;
          align-items: center;
          gap: 11px;
          background: var(--surface2);
          border: 1px solid var(--line);
          border-radius: 15px;
          padding: 11px 18px;
          font-weight: 700;
          transition: transform 0.12s ease, border-color 0.12s ease;
        }
        .store:hover {
          transform: translateY(-2px);
          border-color: #3a414c;
        }
        .store:active {
          transform: scale(0.97);
        }
        .store svg {
          width: 22px;
          height: 22px;
          flex: 0 0 auto;
        }
        .store small {
          display: block;
          font-size: 10.5px;
          color: var(--muted);
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .store span {
          font-size: 15px;
        }
        .trustline {
          margin-top: 20px;
          color: var(--muted);
          font-size: 13.5px;
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }
        @media (max-width: 880px) {
          .trustline {
            justify-content: center;
          }
        }
        .trustline b {
          color: #fff;
        }
        .proof {
          margin-top: 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #c3cad3;
          font-size: 13.5px;
          font-weight: 600;
        }
        .proof b {
          color: #fff;
        }
        .pavatars {
          display: inline-flex;
        }
        .pavatars i {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid var(--bg);
          margin-left: -8px;
        }
        .pavatars i:first-child {
          margin-left: 0;
          background: linear-gradient(135deg, #ffcf4a, #f0a92a);
        }
        .pavatars i:nth-child(2) {
          background: linear-gradient(135deg, #2bd576, #1fa863);
        }
        .pavatars i:nth-child(3) {
          background: linear-gradient(135deg, #6aa3ff, #3f6fe0);
        }
        @media (max-width: 860px) {
          .proof {
            justify-content: center;
          }
        }
        .proofcenter {
          display: inline-flex;
          margin: 18px auto 0;
        }
        .phonewrap {
          display: flex;
          justify-content: center;
        }
        .phone {
          width: 310px;
          background: #000;
          border-radius: 42px;
          padding: 11px;
          box-shadow: 0 0 0 11px #16181c, 0 40px 90px rgba(0, 0, 0, 0.7),
            0 0 80px rgba(43, 213, 118, 0.12);
          position: relative;
        }
        .phone .scr {
          background: var(--bg);
          border-radius: 32px;
          padding: 26px 18px;
          overflow: hidden;
        }
        .ph-eyebrow {
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 800;
        }
        .ph-cap {
          font-family: var(--display);
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-top: 6px;
          line-height: 1;
        }
        .ph-cap small {
          font-size: 18px;
          color: var(--muted);
          font-weight: 700;
        }
        .ph-sub {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          font-size: 13px;
        }
        .ph-sub .trin b {
          color: var(--gold);
        }
        .ph-bar {
          height: 12px;
          background: var(--surface2);
          border-radius: 99px;
          margin-top: 11px;
          border: 1px solid var(--line);
          overflow: hidden;
          box-shadow: 0 0 12px rgba(43, 213, 118, 0.28);
        }
        .ph-bar i {
          display: block;
          height: 100%;
          width: 0;
          border-radius: 99px;
          background: linear-gradient(90deg, #1fa863, var(--accent) 55%, var(--accent-light));
          transition: width 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .ph-goal {
          background: rgba(255, 207, 74, 0.1);
          border: 1px solid rgba(255, 207, 74, 0.3);
          border-radius: 18px;
          padding: 15px;
          margin-top: 16px;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4),
            0 0 22px rgba(255, 207, 74, 0.08);
        }
        .ph-goal .l {
          color: var(--gold);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ph-goal .m {
          font-family: var(--display);
          font-size: 24px;
          font-weight: 700;
          margin-top: 4px;
          letter-spacing: -0.02em;
        }
        .ph-goal .t {
          margin-top: 10px;
          font-size: 12px;
          color: #dfe6ee;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          padding-top: 9px;
        }
        .ph-goal .t b {
          color: var(--accent);
        }
        .ph-rungs {
          margin-top: 16px;
          display: flex;
          flex-direction: column-reverse;
          gap: 6px;
        }
        .rung {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 11px;
          padding: 9px 12px;
          font-size: 12px;
          opacity: 0;
          animation: rungclimb 0.55s cubic-bezier(0.2, 0.85, 0.25, 1) both;
        }
        /* Forskudt nedefra og op → føles som at klatre op ad trappen.
           DOM-rækkefølge er 23,22,21,20 (column-reverse), så nth-child(1)=nederste. */
        .ph-rungs .rung:nth-child(1) {
          animation-delay: 0.35s;
        }
        .ph-rungs .rung:nth-child(2) {
          animation-delay: 0.52s;
        }
        .ph-rungs .rung:nth-child(3) {
          animation-delay: 0.69s;
        }
        .ph-rungs .rung:nth-child(4) {
          animation-delay: 0.86s;
        }
        @keyframes rungclimb {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .rung .d {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--surface2);
          border: 2px solid #2c313a;
        }
        .rung .a {
          margin-left: auto;
          font-weight: 700;
        }
        .rung.done {
          background: #0c1a12;
          border-color: var(--accentDim);
        }
        .rung.done .d {
          background: var(--accent);
          border-color: var(--accent);
        }
        .rung.cur {
          background: linear-gradient(160deg, #241f08, #101013);
          border-color: #574a14;
        }
        .rung.cur .d {
          background: var(--gold);
          border-color: var(--gold);
          box-shadow: 0 0 10px var(--gold);
          animation: dotpulse 2s ease-in-out 1.4s infinite;
        }
        @keyframes dotpulse {
          0%,
          100% {
            box-shadow: 0 0 8px var(--gold);
          }
          50% {
            box-shadow: 0 0 18px var(--gold);
          }
        }
        .rung.cur .n {
          color: var(--gold);
          font-weight: 800;
        }
        section {
          padding: 72px 0;
        }
        .kicker {
          color: var(--accent);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        h2 {
          font-family: var(--display);
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -0.03em;
          line-height: 1.08;
          margin-top: 12px;
          font-weight: 700;
        }
        .section-sub {
          color: #c3cad3;
          font-size: 17px;
          margin-top: 16px;
          max-width: 620px;
        }
        .center {
          text-align: center;
        }
        .center .section-sub {
          margin-left: auto;
          margin-right: auto;
        }
        .why {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          align-items: center;
        }
        @media (max-width: 880px) {
          .why {
            grid-template-columns: 1fr;
          }
        }
        .ladder-vis {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 26px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }
        .lv-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .lv-row:last-child {
          border-bottom: none;
        }
        .lv-step {
          width: 54px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
        }
        .lv-track {
          flex: 1;
          height: 10px;
          background: var(--surface2);
          border-radius: 99px;
          overflow: hidden;
        }
        .lv-track i {
          display: block;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1fa863, var(--accent) 55%, var(--accent-light));
        }
        .lv-amt {
          font-family: var(--display);
          width: 118px;
          text-align: right;
          font-weight: 700;
          font-size: 14px;
        }
        .lv-row.top .lv-amt {
          color: var(--gold);
        }
        .lv-row.top .lv-step {
          color: var(--gold);
        }
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 44px;
        }
        @media (max-width: 780px) {
          .steps {
            grid-template-columns: 1fr;
          }
        }
        .step {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 26px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.24);
        }
        .step .no {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--surface2);
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          color: var(--accent);
        }
        .step h3 {
          font-size: 19px;
          margin: 16px 0 8px;
          font-weight: 800;
        }
        .step p {
          color: var(--muted);
          font-size: 14.5px;
        }
        .spot {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          align-items: center;
          margin-top: 44px;
        }
        @media (max-width: 820px) {
          .spot {
            grid-template-columns: 1fr;
            gap: 22px;
          }
          .spot.rev .spot-vis {
            order: -1;
          }
        }
        .spot-txt h3 {
          font-family: var(--display);
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.12;
          margin: 10px 0 0;
        }
        .spot-txt p {
          color: #c3cad3;
          font-size: 16px;
          line-height: 1.6;
          margin-top: 14px;
          max-width: 460px;
        }
        .spot-vis {
          display: flex;
          justify-content: center;
        }
        .mini-goal,
        .mini-cap,
        .mini-cele {
          width: 100%;
          max-width: 340px;
          background: linear-gradient(160deg, var(--surface), var(--bg));
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
        }
        .mini-goal {
          border-color: rgba(255, 207, 74, 0.28);
        }
        .mini-goal .l,
        .mini-cap .l,
        .dream .l {
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .mini-goal .l {
          color: var(--gold);
        }
        .mini-goal .m {
          display: block;
          font-family: var(--display);
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-top: 6px;
        }
        .mini-bar {
          height: 12px;
          background: var(--surface2);
          border: 1px solid var(--line);
          border-radius: 99px;
          overflow: hidden;
          margin: 14px 0 12px;
          box-shadow: 0 0 12px rgba(43, 213, 118, 0.28);
        }
        .mini-bar i {
          display: block;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1fa863, var(--accent) 55%, var(--accent-light));
        }
        .mini-goal .tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          color: var(--gold);
          background: rgba(255, 207, 74, 0.1);
          border: 1px solid rgba(255, 207, 74, 0.25);
          padding: 4px 11px;
          border-radius: 99px;
        }
        .mini-cap .big {
          display: block;
          font-family: var(--display);
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 4px 0 16px;
        }
        .mini-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 11px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 14px;
          color: #dfe6ee;
        }
        .mini-row b.up {
          color: var(--accent);
          font-weight: 800;
        }
        .badge-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .mbadge {
          font-size: 13px;
          font-weight: 700;
          padding: 8px 13px;
          border-radius: 99px;
          background: var(--surface2);
          border: 1px solid var(--line);
        }
        .mbadge.gold {
          color: #05130b;
          background: linear-gradient(135deg, var(--gold), #f0a92a);
          border: none;
        }
        .dream {
          margin-top: 16px;
          background: rgba(43, 213, 118, 0.06);
          border: 1px solid var(--accentDim);
          border-radius: 16px;
          padding: 16px;
        }
        .dream .m {
          display: block;
          font-family: var(--display);
          font-size: 20px;
          font-weight: 700;
          margin-top: 4px;
        }
        .dream .t {
          display: block;
          font-size: 12px;
          color: var(--muted);
          margin-top: 6px;
        }
        .challenge {
          background: radial-gradient(circle at 20% 0%, rgba(43, 213, 118, 0.1), transparent 55%),
            var(--surface);
          border: 1px solid var(--line);
          border-radius: 32px;
          padding: clamp(28px, 5vw, 56px);
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 44px;
          align-items: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }
        @media (max-width: 880px) {
          .challenge {
            grid-template-columns: 1fr;
          }
        }
        .tag {
          display: inline-block;
          background: var(--accentDim);
          color: #9bf3c2;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.06em;
          padding: 6px 13px;
          border-radius: 99px;
          text-transform: uppercase;
        }
        .challenge h2 {
          margin-top: 14px;
        }
        .rules {
          margin-top: 22px;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .rule {
          display: flex;
          gap: 13px;
          align-items: flex-start;
          font-size: 15.5px;
        }
        .rule .ic {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          flex: 0 0 auto;
          background: rgba(43, 213, 118, 0.14);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
        }
        .hashtag {
          margin-top: 26px;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .hashtag .accent {
          text-shadow: 0 0 24px rgba(43, 213, 118, 0.4);
        }
        .scard {
          background: linear-gradient(160deg, #0c1a12, #06100a);
          border: 1px solid var(--accentDim);
          border-radius: 24px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
        }
        .scard .eb {
          color: var(--accent);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 800;
        }
        .scard .big {
          font-family: var(--display);
          font-size: 46px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 10px 0 2px;
        }
        .scard .sm {
          color: var(--muted);
          font-size: 13px;
        }
        .scard .pr {
          height: 12px;
          background: #0a140e;
          border: 1px solid var(--accentDim);
          border-radius: 99px;
          margin: 18px 0;
          overflow: hidden;
          box-shadow: 0 0 12px rgba(43, 213, 118, 0.28);
        }
        .scard .pr i {
          display: block;
          height: 100%;
          width: 59%;
          background: linear-gradient(90deg, #1fa863, var(--accent) 55%, var(--accent-light));
          border-radius: 99px;
        }
        .scard .wm {
          margin-top: 16px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .feats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 44px;
        }
        @media (max-width: 880px) {
          .feats {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 560px) {
          .feats {
            grid-template-columns: 1fr;
          }
        }
        .feat {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.24);
        }
        .feat .fi {
          font-size: 22px;
        }
        .feat h4 {
          font-size: 16px;
          margin: 12px 0 6px;
          font-weight: 800;
        }
        .feat p {
          color: var(--muted);
          font-size: 14px;
        }
        .livedot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 0 rgba(43, 213, 118, 0.6);
          animation: livedot 2s infinite;
          margin-right: 7px;
          vertical-align: middle;
        }
        .livedot.gold {
          background: var(--gold);
        }
        @keyframes livedot {
          0% {
            box-shadow: 0 0 0 0 rgba(43, 213, 118, 0.5);
          }
          70% {
            box-shadow: 0 0 0 9px rgba(43, 213, 118, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(43, 213, 118, 0);
          }
        }
        .bloggrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 32px;
        }
        @media (max-width: 860px) {
          .bloggrid {
            grid-template-columns: 1fr;
          }
        }
        .bcard {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.24);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .bcard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
          border-color: rgba(43, 213, 118, 0.4);
        }
        .bteaser {
          border-style: dashed;
          border-color: rgba(255, 207, 74, 0.4);
          background: radial-gradient(circle at 0% 0%, rgba(255, 207, 74, 0.08), transparent 60%),
            var(--surface);
        }
        .bteaser:hover {
          border-color: rgba(255, 207, 74, 0.6);
        }
        .btag {
          color: var(--accent);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .btag.gold {
          color: var(--gold);
        }
        .bcard h3 {
          font-family: var(--display);
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.3;
          margin: 12px 0 0;
          color: #fff;
        }
        .bcard p {
          color: var(--muted);
          font-size: 14.5px;
          line-height: 1.55;
          margin: 10px 0 0;
        }
        .bread {
          margin-top: 16px;
          color: var(--accent);
          font-weight: 800;
          font-size: 14px;
        }
        .bread.gold {
          color: var(--gold);
        }
        .bmore {
          display: inline-block;
          background: var(--surface2);
          border: 1px solid var(--line);
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 14px;
          transition: border-color 0.18s ease, transform 0.12s ease;
        }
        .bmore:hover {
          border-color: rgba(43, 213, 118, 0.5);
        }
        .bmore:active {
          transform: scale(0.97);
        }
        .dream {
          position: relative;
          border: 1px solid var(--line);
          border-radius: 30px;
          padding: clamp(34px, 6vw, 66px) clamp(22px, 5vw, 56px);
          background: radial-gradient(120% 120% at 50% 0%, rgba(255, 207, 74, 0.08), transparent 55%),
            linear-gradient(180deg, rgba(43, 213, 118, 0.06), transparent 40%),
            var(--surface);
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.34);
        }
        .dglow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 560px;
          height: 360px;
          background: radial-gradient(circle, rgba(255, 207, 74, 0.16), transparent 65%);
          filter: blur(20px);
          pointer-events: none;
          animation: dreamglow 7s ease-in-out infinite;
        }
        @keyframes dreamglow {
          0%,
          100% {
            opacity: 0.65;
          }
          50% {
            opacity: 1;
          }
        }
        .dcards {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 38px;
        }
        @media (max-width: 760px) {
          .dcards {
            grid-template-columns: 1fr;
          }
        }
        .dcard {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 24px 22px;
          text-align: center;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .dcard:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 207, 74, 0.35);
        }
        .dcard .de {
          font-size: 32px;
        }
        .dcard h4 {
          font-family: var(--display);
          font-size: 19px;
          font-weight: 700;
          margin: 12px 0 6px;
          color: #fff;
        }
        .dcard p {
          color: var(--muted);
          font-size: 14.5px;
          line-height: 1.55;
        }
        .dline {
          position: relative;
          text-align: center;
          margin-top: 34px;
          color: #c3cad3;
          font-size: clamp(16px, 2.4vw, 20px);
          line-height: 1.5;
        }
        .dline b {
          color: var(--gold);
        }
        .faq {
          max-width: 720px;
          margin: 32px auto 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq details {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 4px 20px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.22);
          transition: border-color 0.15s ease;
        }
        .faq details[open] {
          border-color: rgba(43, 213, 118, 0.4);
        }
        .faq summary {
          list-style: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
          padding: 16px 28px 16px 0;
          position: relative;
        }
        .faq summary::-webkit-details-marker {
          display: none;
        }
        .faq summary::after {
          content: "+";
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          font-weight: 400;
          color: var(--accent);
          transition: transform 0.2s ease;
        }
        .faq details[open] summary::after {
          content: "−";
        }
        .faq p {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 16px;
          max-width: 620px;
        }
        .final {
          background: radial-gradient(circle at 50% 0%, rgba(255, 207, 74, 0.1), transparent 60%),
            var(--surface);
          border: 1px solid var(--line);
          border-radius: 32px;
          padding: clamp(34px, 6vw, 68px);
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
        }
        .final h2 {
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }
        .signup {
          display: flex;
          gap: 10px;
          max-width: 440px;
          margin: 28px auto 0;
          flex-wrap: wrap;
        }
        .signup input {
          flex: 1;
          min-width: 200px;
          background: var(--surface2);
          border: 1px solid var(--line);
          color: #fff;
          border-radius: 14px;
          padding: 15px 16px;
          font-size: 15px;
          font-family: inherit;
        }
        .signup input:focus {
          outline: none;
          border-color: var(--accent);
        }
        .signup button {
          background: linear-gradient(
            90deg,
            var(--accent2),
            var(--accent),
            var(--accent-bright),
            var(--accent),
            var(--accent2)
          );
          background-size: 220% 100%;
          animation: ctaslide 3.2s linear infinite;
          box-shadow: 0 8px 22px rgba(43, 213, 118, 0.3);
          color: #05130b;
          border: none;
          border-radius: 14px;
          padding: 15px 26px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.1s ease;
        }
        .signup button:active {
          transform: scale(0.97);
        }
        .signup .ok {
          flex-basis: 100%;
          color: var(--accent);
          font-weight: 700;
          font-size: 14px;
        }
        .finehint {
          margin-top: 14px;
          color: var(--muted);
          font-size: 13px;
        }
        footer {
          border-top: 1px solid var(--line);
          padding: 34px 0;
          margin-top: 30px;
          color: var(--muted);
          font-size: 13.5px;
        }
        footer .frow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        footer .flinks {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
        }
        footer .flinks a {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        footer a:hover {
          color: #fff;
        }
        footer .disc {
          margin-top: 18px;
          max-width: 620px;
          opacity: 0.75;
          line-height: 1.5;
          font-size: 12.5px;
        }
        .reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .signup button,
          .eyebrow .dot,
          .livedot,
          .dglow,
          .rung,
          .rung.cur .d {
            animation: none !important;
          }
          .rung {
            opacity: 1;
          }
          .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .ph-bar i {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
