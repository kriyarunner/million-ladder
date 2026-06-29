"use client";

import { useState } from "react";
import { type Lang, t } from "@/lib/i18n";

type Props = {
  heading: string;
  sub: string;
  button?: string;
  placeholder?: string;
  note?: string;
  variant?: "gold" | "green";
  lang?: Lang;
};

export default function SignupInline({
  heading,
  sub,
  button,
  placeholder,
  note,
  variant = "gold",
  lang = "da",
}: Props) {
  const tr = t(lang).signup;
  const btnLabel = button ?? tr.defaultButton;
  const ph = placeholder ?? tr.placeholder;
  const noteLabel = note ?? tr.note;
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );

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
        if (input) input.value = "";
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={`up ${variant}`}>
      <div className="ic" aria-hidden>
        {variant === "gold" ? "✉️" : "🚀"}
      </div>
      <div className="txt">
        <strong>{heading}</strong>
        <span>{sub}</span>
      </div>
      {status === "ok" ? (
        <p className="done">{tr.done}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={ph}
            required
            aria-label="E-mail"
            disabled={status === "loading"}
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? tr.sending : btnLabel}
          </button>
          {status === "error" && <span className="err">{tr.error}</span>}
          <span className="note">{noteLabel}</span>
        </form>
      )}

      <style jsx>{`
        .up {
          margin: 36px 0 8px;
          padding: 26px 26px 22px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: var(--surface);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
        }
        .up.gold {
          border-color: rgba(255, 207, 74, 0.4);
          background: radial-gradient(circle at 0% 0%, rgba(255, 207, 74, 0.1), transparent 60%),
            var(--surface);
        }
        .up.green {
          border-color: rgba(43, 213, 118, 0.35);
          background: radial-gradient(circle at 0% 0%, rgba(43, 213, 118, 0.1), transparent 60%),
            var(--surface);
        }
        .ic {
          font-size: 26px;
        }
        .txt {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .txt strong {
          font-family: var(--display);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #fff;
        }
        .txt span {
          color: #c3cad3;
          font-size: 15px;
          line-height: 1.55;
        }
        form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        input {
          flex: 1;
          min-width: 200px;
          background: var(--surface2);
          border: 1px solid var(--line);
          color: #fff;
          border-radius: 13px;
          padding: 14px 15px;
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
          border-radius: 13px;
          padding: 14px 22px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 8px 22px rgba(43, 213, 118, 0.28);
          transition: transform 0.1s ease;
          white-space: nowrap;
        }
        button:active {
          transform: scale(0.97);
        }
        button:disabled,
        input:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .note {
          flex-basis: 100%;
          color: var(--muted);
          font-size: 12.5px;
          margin-top: 2px;
        }
        .err {
          flex-basis: 100%;
          color: var(--red);
          font-size: 13px;
          font-weight: 700;
        }
        .done {
          margin-top: 14px;
          color: var(--accent);
          font-weight: 700;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}
