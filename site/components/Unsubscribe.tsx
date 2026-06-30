"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { type Lang, t, withLocale } from "@/lib/i18n";

type View = "confirm" | "done" | "resubbed" | "invalid";

export default function Unsubscribe({ lang }: { lang: Lang }) {
  const tr = t(lang).unsub;
  const params = useSearchParams();
  const email = (params.get("e") || "").trim();
  const token = (params.get("t") || "").trim();

  const [view, setView] = useState<View>("confirm");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!email || !token) setView("invalid");
  }, [email, token]);

  async function call(action: "unsubscribe" | "resubscribe") {
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, token, action }),
      });
      if (res.ok) {
        setView(action === "unsubscribe" ? "done" : "resubbed");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const home = withLocale(lang, "/");

  return (
    <main className="wrap">
      <div className="card">
        <img
          className="logo"
          src="/icon-512.png"
          alt="Million Ladder"
          width={52}
          height={52}
        />

        {view === "invalid" && (
          <>
            <h1>{tr.invalidTitle}</h1>
            <p className="lead">{tr.invalid}</p>
            <Link className="ghost" href={home}>
              {tr.backHome}
            </Link>
          </>
        )}

        {view === "confirm" && (
          <>
            <span className="eyebrow">{tr.eyebrow}</span>
            <h1>{tr.title}</h1>
            <p className="lead">{tr.lead}</p>
            <p className="punch">{tr.punch}</p>
            {email && (
              <p className="email">
                {tr.emailLabel} <b>{email}</b>
              </p>
            )}
            <button
              className="primary"
              onClick={() => (window.location.href = home)}
            >
              {tr.stay}
            </button>
            <button
              className="link"
              onClick={() => call("unsubscribe")}
              disabled={busy}
            >
              {busy ? tr.working : tr.confirm}
            </button>
            {error && <p className="err">{tr.error}</p>}
          </>
        )}

        {view === "done" && (
          <>
            <div className="emoji" aria-hidden>
              👋
            </div>
            <h1>{tr.doneTitle}</h1>
            <p className="lead">{tr.doneText}</p>
            <button
              className="primary"
              onClick={() => call("resubscribe")}
              disabled={busy}
            >
              {busy ? tr.resubWorking : tr.resub}
            </button>
            <Link className="link" href={home}>
              {tr.backHome}
            </Link>
            {error && <p className="err">{tr.error}</p>}
          </>
        )}

        {view === "resubbed" && (
          <>
            <div className="emoji" aria-hidden>
              🎉
            </div>
            <h1>{tr.resubDone}</h1>
            <Link className="primary" href={home}>
              {tr.backHome}
            </Link>
          </>
        )}
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: radial-gradient(
              circle at 50% 0%,
              rgba(43, 213, 118, 0.1),
              transparent 55%
            ),
            #04060a;
        }
        .card {
          width: 100%;
          max-width: 440px;
          text-align: center;
          background: #0b0f15;
          border: 1px solid #1b212b;
          border-radius: 22px;
          padding: 36px 30px 30px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
        }
        .logo {
          display: block;
          margin: 0 auto;
          border-radius: 15px;
        }
        .emoji {
          font-size: 40px;
          margin-top: 6px;
        }
        .eyebrow {
          display: inline-block;
          margin-top: 20px;
          color: #ffcf4a;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        h1 {
          margin: 12px 0 0;
          color: #fff;
          font-size: 23px;
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .lead {
          margin: 14px 0 0;
          color: #c3cad3;
          font-size: 15px;
          line-height: 1.6;
        }
        .punch {
          margin: 14px 0 0;
          color: #fff;
          font-size: 15px;
          line-height: 1.55;
          font-weight: 700;
        }
        .email {
          margin: 16px 0 0;
          color: #8a909a;
          font-size: 13px;
        }
        .email b {
          color: #c3cad3;
        }
        .primary {
          display: block;
          width: 100%;
          margin-top: 22px;
          background: linear-gradient(135deg, #2bd576, #1fa863);
          color: #05130b;
          border: none;
          border-radius: 13px;
          padding: 15px 22px;
          font-size: 15px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 8px 22px rgba(43, 213, 118, 0.28);
          transition: transform 0.1s ease;
        }
        .primary:active {
          transform: scale(0.98);
        }
        .link,
        .ghost {
          display: inline-block;
          width: 100%;
          margin-top: 14px;
          background: none;
          border: none;
          color: #9aa1ac;
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          text-decoration: underline;
          padding: 6px;
        }
        .ghost {
          margin-top: 22px;
          text-decoration: none;
          color: #2bd576;
          font-weight: 700;
        }
        .link:hover {
          color: #fff;
        }
        .link:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .err {
          margin: 12px 0 0;
          color: #ff6b6b;
          font-size: 13px;
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
