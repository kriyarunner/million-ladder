"use client";

import { useState } from "react";
import CoinFall from "./CoinFall";

export default function ComingSoon() {
  const [ok, setOk] = useState(false);
  const year = new Date().getFullYear();

  return (
    <div className="page">
      <CoinFall variant="fixed" />
      <div className="glow" />

      <span className="badge">
        <span className="dot" /> Snart her · iOS &amp; Android
      </span>

      <div className="mark">
        <svg viewBox="0 0 1024 1024">
          <path
            d="M 300 730 L 300 300 L 512 540 L 724 300 L 724 730"
            fill="none"
            stroke="#ffcf4a"
            strokeWidth={106}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h1>
        Fra <span className="num">0</span> til{" "}
        <span className="num">1.000.000 kr.</span>
        <br />i 37 handler.
      </h1>
      <p className="sub">
        Ryd op. Sælg det du ikke bruger. Geninvester.{" "}
        <b>Million Ladder viser dig altid dit næste minimums-salg</b> på vejen
        mod en million.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector("input");
          if (input) input.value = "";
          setOk(true);
        }}
      >
        <input type="email" placeholder="din@email.dk" required aria-label="E-mail" />
        <button type="submit">Giv mig besked ved launch</button>
        {ok && <span className="ok">Tak! Du er på listen. 🚀</span>}
      </form>
      <p className="hint">
        Gratis ved launch · Ingen spam · Årets challenge er på vej
      </p>

      <footer>© {year} Million Ladder</footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 28px;
          overflow: hidden;
          position: relative;
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
          top: -160px;
          left: 50%;
          transform: translateX(-50%);
          width: 720px;
          height: 720px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43, 213, 118, 0.16), transparent 60%);
          filter: blur(20px);
        }
        .glow::after {
          content: "";
          position: absolute;
          bottom: -180px;
          right: -120px;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 207, 74, 0.07), transparent 60%);
          filter: blur(20px);
        }
        .mark {
          width: 92px;
          height: 92px;
          border-radius: 24px;
          background: linear-gradient(135deg, #2bd576, #1fa863);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          box-shadow: 0 18px 50px rgba(255, 207, 74, 0.3);
          animation: float 5s ease-in-out infinite;
        }
        .mark svg {
          width: 54px;
          height: 54px;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-9px);
          }
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 800;
          border: 1px solid rgba(255, 207, 74, 0.28);
          background: rgba(255, 207, 74, 0.07);
          padding: 8px 16px;
          border-radius: 99px;
          margin-bottom: 26px;
        }
        .badge .dot {
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
          font-size: clamp(34px, 7vw, 62px);
          line-height: 1.04;
          letter-spacing: -0.035em;
          font-weight: 800;
          max-width: 760px;
        }
        h1 .num {
          background: linear-gradient(120deg, var(--accent), #8bf0b8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        p.sub {
          color: #c3cad3;
          font-size: clamp(16px, 2.4vw, 19px);
          margin: 22px auto 0;
          max-width: 520px;
        }
        p.sub b {
          color: #fff;
        }
        form {
          display: flex;
          gap: 10px;
          max-width: 440px;
          width: 100%;
          margin: 34px auto 0;
          flex-wrap: wrap;
        }
        input {
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
        input:focus {
          outline: none;
          border-color: var(--accent);
        }
        button {
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
        button:active {
          transform: scale(0.97);
        }
        .ok {
          flex-basis: 100%;
          color: var(--accent);
          font-weight: 700;
          font-size: 14px;
        }
        .hint {
          margin-top: 16px;
          color: var(--muted);
          font-size: 13.5px;
        }
        footer {
          position: absolute;
          bottom: 22px;
          color: var(--muted);
          font-size: 12.5px;
        }
      `}</style>
    </div>
  );
}
