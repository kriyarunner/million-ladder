"use client";

import { useEffect, useRef, useState } from "react";
import CoinFall from "./CoinFall";

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bar = root.querySelector("#phbar") as HTMLElement | null;
    if (bar) requestAnimationFrame(() => (bar.style.width = "62%"));

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

      <nav>
        <div className="wrap">
          <div className="logo">
            <span className="mark">M</span> Million Ladder
          </div>
          <div className="navlinks">
            <a href="#why">Hvorfor 37</a>
            <a href="#how">Sådan virker det</a>
            <a href="#challenge">Challenge</a>
            <a href="#download" className="cta">
              Hent gratis
            </a>
          </div>
        </div>
      </nav>

      <header>
        <CoinFall variant="absolute" />
        <div className="wrap hero">
          <div>
            <span className="eyebrow">
              <span className="dot" /> Årets challenge på TikTok
            </span>
            <h1>
              Fra <span className="num">0</span> til{" "}
              <span className="num">1.000.000 kr.</span>
              <br />i 37 handler.
            </h1>
            <p className="lead">
              Ryd op derhjemme. Sælg det du ikke bruger. Geninvester gevinsten.{" "}
              <b>Million Ladder viser dig altid dit næste minimums-salg</b> — og
              hvor få handler der faktisk er tilbage til toppen.
            </p>
            <div className="ctas" id="download">
              <a className="store" href="#" aria-label="Hent i App Store">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.36 1.43c.07 1.02-.32 2.03-.96 2.77-.66.78-1.74 1.38-2.79 1.3-.09-1 .39-2.04 1-2.72.68-.78 1.86-1.36 2.75-1.35zM20.4 17.1c-.5 1.16-.74 1.67-1.39 2.69-.9 1.42-2.18 3.2-3.76 3.21-1.4.02-1.77-.92-3.67-.9-1.9.01-2.3.92-3.71.9-1.58-.01-2.79-1.6-3.7-3.02C1.7 16.06 1.43 11.4 3 8.96c1.1-1.73 2.85-2.74 4.49-2.74 1.67 0 2.72.92 4.1.92 1.34 0 2.16-.92 4.09-.92 1.46 0 3 .8 4.1 2.17-3.6 1.97-3.02 7.1.62 8.71z" />
                </svg>
                <span>
                  <small>Hent i</small>App Store
                </span>
              </a>
              <a className="store" href="#" aria-label="Hent på Google Play">
                <svg viewBox="0 0 24 24">
                  <path fill="#2bd576" d="M3.6 2.3 13 11.7l-9.4 9.4c-.3-.2-.5-.6-.5-1.1V3.4c0-.5.2-.9.5-1.1z" />
                  <path fill="#ffcf4a" d="M16.5 8.8 13 11.7l2.6 2.6 3.9-2.2c.8-.5.8-1.6 0-2.1l-3-1.2z" />
                  <path fill="#fff" d="M3.6 2.3c.3-.2.7-.2 1.1 0l11.8 6.5L13 11.7 3.6 2.3z" />
                  <path fill="#8a909a" d="M13 11.7l3.5 2.6L4.7 20.8c-.4.2-.8.2-1.1 0L13 11.7z" />
                </svg>
                <span>
                  <small>Hent på</small>Google Play
                </span>
              </a>
            </div>
            <div className="trustline">
              <span>
                <b>Gratis</b> ved launch
              </span>
              <span>
                <b>100%</b> offline
              </span>
              <span>
                <b>Ingen</b> login
              </span>
            </div>
          </div>

          <div className="phonewrap">
            <div className="phone">
              <div className="scr">
                <div className="ph-eyebrow">I kassen</div>
                <div className="ph-cap">
                  386.400 <small>kr.</small>
                </div>
                <div className="ph-sub">
                  <span className="trin">
                    Trin <b>22</b> / 37
                  </span>
                  <span className="muted">62%</span>
                </div>
                <div className="ph-bar">
                  <i id="phbar" />
                </div>
                <div className="ph-goal">
                  <div className="l">Dit næste mål</div>
                  <div className="m">+38.640 kr.</div>
                  <div className="t">
                    Minimum næste salg: <b>én handel</b> til ~38.640 kr. løfter
                    dig til trin 23.
                  </div>
                </div>
                <div className="ph-rungs">
                  <div className="rung cur">
                    <span className="d" />
                    <span className="n">23</span>
                    <span className="a gold">425.040</span>
                  </div>
                  <div className="rung done">
                    <span className="d" />
                    <span className="n">22</span>
                    <span className="a">386.400</span>
                  </div>
                  <div className="rung done">
                    <span className="d" />
                    <span className="n">21</span>
                    <span className="a">351.270</span>
                  </div>
                  <div className="rung done">
                    <span className="d" />
                    <span className="n">20</span>
                    <span className="a">319.330</span>
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
            <div className="kicker">Den skjulte matematik</div>
            <h2>
              Du tænker ikke på,
              <br />at der kun er <span className="gold">37 handler</span> tilbage.
            </h2>
            <p className="section-sub">
              Det føles uendeligt langt til en million. Men når hver handel bygger
              oven på den forrige, er der overraskende få trin til toppen. Million
              Ladder gør det konkret: ét trin ad gangen, ét salg ad gangen.
            </p>
            <p className="section-sub">
              Ingen aktier. Ingen gæld. Bare det du allerede har — solgt smartere.
            </p>
          </div>
          <div className="ladder-vis reveal">
            <div className="lv-row top">
              <span className="lv-step">Trin 37</span>
              <div className="lv-track">
                <i style={{ width: "100%" }} />
              </div>
              <span className="lv-amt">1.000.000</span>
            </div>
            <div className="lv-row">
              <span className="lv-step">Trin 30</span>
              <div className="lv-track">
                <i style={{ width: "64%" }} />
              </div>
              <span className="lv-amt">643.000</span>
            </div>
            <div className="lv-row">
              <span className="lv-step">Trin 22</span>
              <div className="lv-track">
                <i style={{ width: "38%" }} />
              </div>
              <span className="lv-amt">386.400</span>
            </div>
            <div className="lv-row">
              <span className="lv-step">Trin 12</span>
              <div className="lv-track">
                <i style={{ width: "14%" }} />
              </div>
              <span className="lv-amt">142.000</span>
            </div>
            <div className="lv-row">
              <span className="lv-step">Trin 5</span>
              <div className="lv-track">
                <i style={{ width: "4%" }} />
              </div>
              <span className="lv-amt">38.000</span>
            </div>
            <div className="lv-row">
              <span className="lv-step">Trin 1</span>
              <div className="lv-track">
                <i style={{ width: "1%" }} />
              </div>
              <span className="lv-amt">500</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how">
        <div className="wrap">
          <div className="center reveal">
            <div className="kicker">Sådan virker det</div>
            <h2>Tre trin. Igen og igen.</h2>
            <p className="section-sub">
              Hele systemet er bygget på én simpel loop — så simpel at du faktisk
              gør det.
            </p>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="no">1</div>
              <h3>Ryd op &amp; sælg</h3>
              <p>
                Find det du ikke bruger derhjemme — eller køb billigt for at sælge
                dyrere. Du starter helt fra 0 kr.
              </p>
            </div>
            <div className="step reveal">
              <div className="no">2</div>
              <h3>Log handlen</h3>
              <p>
                Indtast købspris og salg. Appen regner profit, ROI og din kapital
                ud automatisk.
              </p>
            </div>
            <div className="step reveal">
              <div className="no">3</div>
              <h3>Stig op ad trappen</h3>
              <p>
                Hver handel løfter dig mod næste trin. Du ser altid præcis hvad
                dit næste minimums-salg skal være.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE */}
      <section id="challenge">
        <div className="wrap">
          <div className="challenge reveal">
            <div>
              <span className="tag">#MillionLadderChallenge</span>
              <h2>
                Tag challengen.
                <br />Film rejsen.
              </h2>
              <p className="section-sub" style={{ marginTop: "14px" }}>
                Start småt — fx 1 kr, 1 €, eller bare det første du sælger.
                Dokumentér hvert trin på TikTok. Million Ladder giver dig det
                delbare bevis efter hver handel.
              </p>
              <div className="rules">
                <div className="rule">
                  <span className="ic">1</span>
                  <span>
                    <b>Start fra bunden.</b> Vælg din startkapital — jo mindre, jo
                    vildere historie.
                  </span>
                </div>
                <div className="rule">
                  <span className="ic">2</span>
                  <span>
                    <b>Geninvester alt.</b> Hver gevinst går videre til næste
                    handel.
                  </span>
                </div>
                <div className="rule">
                  <span className="ic">3</span>
                  <span>
                    <b>Del hvert trin.</b> Post dit progress-kort og byg dit
                    publikum trin for trin.
                  </span>
                </div>
              </div>
              <div className="hashtag">
                Følg med fra <span className="accent">trin 1</span> til{" "}
                <span className="gold">million</span>.
              </div>
            </div>
            <div className="scard reveal">
              <div className="eb">Million Ladder</div>
              <div className="big gold">Trin 22 / 37</div>
              <div className="sm">386.400 kr. i kassen</div>
              <div className="pr">
                <i />
              </div>
              <div className="sm">62% af vejen til 1.000.000 kr.</div>
              <div className="wm">↗ delt fra Million Ladder-appen</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="wrap">
          <div className="center reveal">
            <div className="kicker">I appen</div>
            <h2>Alt du behøver — intet du ikke gør.</h2>
          </div>
          <div className="feats">
            <div className="feat reveal">
              <div className="fi gold">🪜</div>
              <h4>37-trins trappe</h4>
              <p>En klar, visuel vej fra 0 til 1.000.000 kr.</p>
            </div>
            <div className="feat reveal">
              <div className="fi accent">🎯</div>
              <h4>Næste minimums-salg</h4>
              <p>Du ved altid præcis hvad der skal til for næste trin.</p>
            </div>
            <div className="feat reveal">
              <div className="fi">🔥</div>
              <h4>Ugentlig streak</h4>
              <p>Hold momentum ved at handle hver uge.</p>
            </div>
            <div className="feat reveal">
              <div className="fi gold">👑</div>
              <h4>Milepæle</h4>
              <p>Fejr de store trin med konfetti og badges.</p>
            </div>
            <div className="feat reveal">
              <div className="fi accent">📤</div>
              <h4>Delbart progress-kort</h4>
              <p>Et flot kort til hvert TikTok-opslag.</p>
            </div>
            <div className="feat reveal">
              <div className="fi">📶</div>
              <h4>Offline &amp; privat</h4>
              <p>Alt gemmes på din telefon. Ingen konto, ingen sky.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="wrap">
          <div className="final reveal">
            <div className="kicker">Vær med fra start</div>
            <h2>
              Din vej til en million
              <br />starter med ét salg.
            </h2>
            <p className="section-sub center">
              Skriv dig op, så siger vi til når appen lander — og når challengen
              går live.
            </p>
            <form
              className="signup"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector("input");
                if (input) input.value = "";
                setOk(true);
              }}
            >
              <input
                type="email"
                placeholder="din@email.dk"
                required
                aria-label="E-mail"
              />
              <button type="submit">Hold mig opdateret</button>
              {ok && <span className="ok">Tak! Du er på listen. 🚀</span>}
            </form>
            <p className="finehint">
              Gratis ved launch · iOS &amp; Android · Vi spammer ikke.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="logo">
            <span className="mark">M</span> Million Ladder
          </div>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
            <a href="#why">Hvorfor 37</a>
            <a href="#how">Sådan virker det</a>
            <a href="#challenge">Challenge</a>
            <a href="#download">Hent</a>
          </div>
          <div>© {year} Million Ladder</div>
        </div>
      </footer>

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
        nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(14px);
          background: rgba(0, 0, 0, 0.6);
          border-bottom: 1px solid var(--line);
        }
        nav .wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 66px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 11px;
          font-weight: 800;
          font-size: 17px;
          letter-spacing: -0.01em;
        }
        .logo .mark {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: linear-gradient(135deg, #2bd576, #1fa863);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          font-weight: 800;
          font-size: 16px;
          box-shadow: 0 6px 18px rgba(255, 207, 74, 0.22);
        }
        .navlinks {
          display: flex;
          align-items: center;
          gap: 28px;
          font-size: 14.5px;
          font-weight: 600;
          color: var(--muted);
        }
        .navlinks a:hover {
          color: #fff;
        }
        .navlinks .cta {
          color: #05130b;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          padding: 9px 18px;
          border-radius: 99px;
          font-weight: 800;
        }
        @media (max-width: 720px) {
          .navlinks a:not(.cta) {
            display: none;
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
          font-size: clamp(40px, 6.2vw, 68px);
          line-height: 1.02;
          letter-spacing: -0.035em;
          font-weight: 800;
          margin: 22px 0 0;
        }
        h1 .num {
          background: linear-gradient(120deg, var(--accent), #8bf0b8);
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
          font-size: 44px;
          font-weight: 800;
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
          height: 11px;
          background: var(--surface2);
          border-radius: 99px;
          margin-top: 11px;
          border: 1px solid var(--line);
          overflow: hidden;
        }
        .ph-bar i {
          display: block;
          height: 100%;
          width: 0;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--accent), #8bf0b8);
          transition: width 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .ph-goal {
          background: rgba(255, 207, 74, 0.1);
          border: 1px solid rgba(255, 207, 74, 0.3);
          border-radius: 18px;
          padding: 15px;
          margin-top: 16px;
        }
        .ph-goal .l {
          color: var(--gold);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ph-goal .m {
          font-size: 24px;
          font-weight: 800;
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
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -0.03em;
          line-height: 1.08;
          margin-top: 12px;
          font-weight: 800;
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
          background: linear-gradient(90deg, var(--accent), #8bf0b8);
        }
        .lv-amt {
          width: 118px;
          text-align: right;
          font-weight: 800;
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
          font-size: 46px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 10px 0 2px;
        }
        .scard .sm {
          color: var(--muted);
          font-size: 13px;
        }
        .scard .pr {
          height: 10px;
          background: #0a140e;
          border: 1px solid var(--accentDim);
          border-radius: 99px;
          margin: 18px 0;
          overflow: hidden;
        }
        .scard .pr i {
          display: block;
          height: 100%;
          width: 62%;
          background: linear-gradient(90deg, var(--accent), #8bf0b8);
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
        .final {
          background: radial-gradient(circle at 50% 0%, rgba(255, 207, 74, 0.1), transparent 60%),
            var(--surface);
          border: 1px solid var(--line);
          border-radius: 32px;
          padding: clamp(34px, 6vw, 68px);
          text-align: center;
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
          background: linear-gradient(135deg, var(--accent), var(--accent2));
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
        }
        footer .wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          color: var(--muted);
          font-size: 13.5px;
        }
        footer a:hover {
          color: #fff;
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
      `}</style>
    </div>
  );
}
