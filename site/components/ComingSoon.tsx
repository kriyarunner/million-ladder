"use client";

import { useEffect, useState } from "react";
import CoinFall from "./CoinFall";

const COUNT_THRESHOLD = 15;

export default function ComingSoon() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [count, setCount] = useState<number | null>(null);
  const year = new Date().getFullYear();

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    const email = input?.value.trim();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        setCount((c) => (c === null ? c : c + 1));
        if (input) input.value = "";
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="page">
      <CoinFall variant="fixed" />
      <div className="glow" />

      <span className="badge">
        <span className="dot" /> Snart her · iOS &amp; Android
      </span>

      <div className="stage">
        <div className="hero">
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
            <b>Million Ladder viser dig altid dit næste minimums-salg</b> på
            vejen mod en million.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="din@email.dk"
              required
              aria-label="E-mail"
              disabled={status === "loading"}
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading"
                ? "Tilmelder…"
                : "Giv mig besked ved launch"}
            </button>
            {status === "ok" && (
              <span className="ok">Tak! Du er på listen. 🚀</span>
            )}
            {status === "error" && (
              <span className="err">Noget gik galt – prøv igen.</span>
            )}
          </form>

          <div className="count">
            <span className="avatars" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            {count !== null && count >= COUNT_THRESHOLD ? (
              <span>
                Allerede <b>{count.toLocaleString("da-DK")}</b> på ventelisten 🔥
              </span>
            ) : (
              <span>Bliv en af de første på ventelisten</span>
            )}
          </div>

          <div className="socials">
            <a
              className="social"
              href="https://www.tiktok.com/@millionladderapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M16.5 3c.3 2.1 1.6 3.7 3.7 4v2.4c-1.3.1-2.5-.3-3.7-1v6.7c0 3.4-2.5 5.9-5.8 5.9-3.1 0-5.4-2.3-5.4-5.3 0-3.2 2.7-5.4 6.2-5v2.5c-.4-.1-.9-.2-1.3-.2-1.4 0-2.5 1-2.5 2.5 0 1.5 1.1 2.6 2.6 2.6 1.6 0 2.6-1.1 2.6-3V3h3.6Z"
                />
              </svg>
              TikTok
            </a>
            <a
              className="social"
              href="https://www.instagram.com/millionladderapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .47 1.4.9.43.4.7.8.9 1.4.17.4.37 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.2.6-.47 1-.9 1.4-.4.43-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.2-1-.47-1.4-.9-.43-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.47-1 .9-1.4.4-.43.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-.9.04-1.4.2-1.7.32-.43.17-.74.37-1.06.7-.32.31-.52.62-.7 1.05-.12.3-.28.8-.32 1.7C3.45 9.05 3.45 9.4 3.45 12s0 3 .07 4.1c.04.9.2 1.4.32 1.7.17.43.37.74.7 1.06.31.32.62.52 1.05.7.3.12.8.28 1.7.32 1.2.06 1.6.07 4.7.07s3.5 0 4.7-.07c.9-.04 1.4-.2 1.7-.32.43-.17.74-.37 1.06-.7.32-.31.52-.62.7-1.05.12-.3.28-.8.32-1.7.06-1.2.07-1.5.07-4.1s0-3-.07-4.1c-.04-.9-.2-1.4-.32-1.7a2.8 2.8 0 0 0-.7-1.06 2.8 2.8 0 0 0-1.05-.7c-.3-.12-.8-.28-1.7-.32C15.5 4 15.1 4 12 4Zm0 3.05A4.95 4.95 0 1 1 12 17a4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.15-.9a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z"
                />
              </svg>
              Instagram
            </a>
          </div>

          <p className="hint">
            Gratis ved launch · Ingen spam · Årets challenge er på vej
          </p>
        </div>

        <div className="preview" aria-hidden>
          <div className="phone">
            <div className="notch" />
            <div className="screen">
              <div className="p-head">
                <span className="p-logo">M</span>
                <span className="p-name">Million Ladder</span>
              </div>
              <div className="p-step">Trin 12 / 37</div>
              <div className="p-bar">
                <span style={{ width: "32%" }} />
              </div>
              <div className="p-balance">
                <span className="p-label">Din saldo</span>
                <span className="p-amount">7.400 kr.</span>
              </div>
              <div className="p-card">
                <span className="p-card-label">Næste minimums-salg</span>
                <span className="p-card-amount">1.850 kr.</span>
                <span className="p-card-tag">Klar til næste</span>
              </div>
              <div className="p-rungs">
                <span className="done" />
                <span className="done" />
                <span className="done" />
                <span className="now" />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="disc">
          Million Ladder er en motivations- og oprydnings-app. Ikke finansiel
          rådgivning, og vi lover ingen økonomisk gevinst.
        </div>
        <div className="links">
          <a
            href="https://www.tiktok.com/@millionladderapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            TikTok
          </a>{" "}
          ·{" "}
          <a
            href="https://www.instagram.com/millionladderapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>{" "}
          · <a href="/terms">Vilkår</a> · <a href="/privacy">Privatliv</a> · ©{" "}
          {year} Million Ladder
        </div>
      </footer>

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
        .page > * {
          max-width: 100%;
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
        .stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 560px;
        }
        @media (min-width: 940px) {
          .stage {
            flex-direction: row;
            align-items: center;
            gap: 56px;
            max-width: 1040px;
            text-align: left;
          }
          .hero {
            align-items: flex-start;
            flex: 1;
          }
          .hero h1,
          .hero p.sub {
            text-align: left;
            margin-left: 0;
            margin-right: 0;
          }
          .hero .mark {
            margin-left: 0;
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
          font-size: clamp(32px, 7vw, 62px);
          line-height: 1.04;
          letter-spacing: -0.035em;
          font-weight: 800;
          width: 100%;
          max-width: 760px;
          overflow-wrap: break-word;
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
          width: 100%;
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
        button:disabled,
        input:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .ok {
          flex-basis: 100%;
          color: var(--accent);
          font-weight: 700;
          font-size: 14px;
        }
        .err {
          flex-basis: 100%;
          color: var(--red);
          font-weight: 700;
          font-size: 14px;
        }
        .count {
          margin-top: 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #c3cad3;
          font-size: 13.5px;
          font-weight: 600;
        }
        .count b {
          color: #fff;
        }
        .avatars {
          display: inline-flex;
        }
        .avatars i {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid var(--bg);
          margin-left: -8px;
          background: linear-gradient(135deg, #2bd576, #1fa863);
        }
        .avatars i:first-child {
          margin-left: 0;
          background: linear-gradient(135deg, #ffcf4a, #f0a92a);
        }
        .avatars i:nth-child(2) {
          background: linear-gradient(135deg, #2bd576, #1fa863);
        }
        .avatars i:nth-child(3) {
          background: linear-gradient(135deg, #6aa3ff, #3f6fe0);
        }
        .socials {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .social {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 18px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.14);
          transition: border-color 0.15s ease, transform 0.1s ease,
            background 0.15s ease;
        }
        .social:hover {
          border-color: var(--accent);
          background: rgba(43, 213, 118, 0.08);
        }
        .social:active {
          transform: scale(0.97);
        }
        .social svg {
          width: 17px;
          height: 17px;
          color: var(--gold);
        }
        @media (min-width: 940px) {
          .socials {
            justify-content: flex-start;
          }
        }
        .hint {
          margin-top: 16px;
          color: var(--muted);
          font-size: 13.5px;
          width: 100%;
          max-width: 520px;
        }
        .preview {
          flex-shrink: 0;
          margin-top: 36px;
          perspective: 1200px;
        }
        @media (min-width: 940px) {
          .preview {
            margin-top: 0;
          }
        }
        .phone {
          width: 244px;
          height: 500px;
          border-radius: 38px;
          background: linear-gradient(160deg, #1a1e24, #0c0e12);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset;
          padding: 12px;
          position: relative;
          animation: tilt 7s ease-in-out infinite;
        }
        @keyframes tilt {
          0%,
          100% {
            transform: rotateY(-9deg) rotateX(3deg) translateY(0);
          }
          50% {
            transform: rotateY(-4deg) rotateX(2deg) translateY(-10px);
          }
        }
        .notch {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 96px;
          height: 22px;
          border-radius: 99px;
          background: #06070a;
          z-index: 2;
        }
        .screen {
          width: 100%;
          height: 100%;
          border-radius: 28px;
          background: radial-gradient(
              120% 80% at 50% 0%,
              rgba(43, 213, 118, 0.14),
              transparent 60%
            ),
            #06120c;
          padding: 38px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow: hidden;
        }
        .p-head {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .p-logo {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: linear-gradient(135deg, #2bd576, #1fa863);
          color: var(--gold);
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-name {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }
        .p-step {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .p-bar {
          height: 9px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }
        .p-bar span {
          display: block;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #2bd576, #8bf0b8);
        }
        .p-balance {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 2px;
        }
        .p-label {
          font-size: 11px;
          color: var(--muted);
          font-weight: 600;
        }
        .p-amount {
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .p-card {
          margin-top: auto;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .p-card-label {
          font-size: 10.5px;
          color: var(--muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .p-card-amount {
          font-size: 22px;
          font-weight: 800;
          color: var(--accent);
        }
        .p-card-tag {
          align-self: flex-start;
          margin-top: 4px;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--gold);
          background: rgba(255, 207, 74, 0.1);
          border: 1px solid rgba(255, 207, 74, 0.25);
          padding: 3px 9px;
          border-radius: 99px;
        }
        .p-rungs {
          display: flex;
          gap: 6px;
        }
        .p-rungs span {
          flex: 1;
          height: 5px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.08);
        }
        .p-rungs .done {
          background: var(--accent2);
        }
        .p-rungs .now {
          background: var(--gold);
        }
        footer {
          margin-top: auto;
          padding: 40px 20px 2px;
          width: 100%;
          color: var(--muted);
          font-size: 12px;
        }
        footer .disc {
          max-width: 560px;
          margin: 0 auto 7px;
          opacity: 0.75;
          line-height: 1.45;
        }
        footer .links a {
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        footer .links a:hover {
          color: #fff;
        }
      `}</style>
    </div>
  );
}
