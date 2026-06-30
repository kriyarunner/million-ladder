"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { type Lang, t } from "@/lib/i18n";

type Ctx = { open: () => void };

const SignupModalContext = createContext<Ctx>({ open: () => {} });

export function useSignupModal() {
  return useContext(SignupModalContext);
}

export default function SignupModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const lang: Lang =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : "da";
  const tr = t(lang).modal;

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );

  const open = useCallback(() => {
    setStatus("idle");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

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
        body: JSON.stringify({ email, lang }),
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
    <SignupModalContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="ovl"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={tr.title}
        >
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="x"
              onClick={close}
              aria-label={tr.close}
            >
              ×
            </button>
            <div className="ic" aria-hidden>
              🚀
            </div>
            <span className="badge">{tr.badge}</span>
            <h3>{tr.title}</h3>
            <p className="sub">{tr.sub}</p>

            {status === "ok" ? (
              <p className="done">{tr.done}</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder={tr.placeholder}
                  required
                  autoFocus
                  aria-label={tr.placeholder}
                  disabled={status === "loading"}
                />
                <button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? tr.sending : tr.button}
                </button>
                {status === "error" && <span className="err">{tr.error}</span>}
                <span className="note">{tr.note}</span>
              </form>
            )}
          </div>

          <style jsx>{`
            .ovl {
              position: fixed;
              inset: 0;
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 22px;
              background: rgba(4, 6, 9, 0.72);
              backdrop-filter: blur(6px);
              animation: fade 0.18s ease;
            }
            .card {
              position: relative;
              width: 100%;
              max-width: 440px;
              border-radius: 22px;
              border: 1px solid rgba(255, 207, 74, 0.4);
              background: radial-gradient(
                  circle at 0% 0%,
                  rgba(255, 207, 74, 0.12),
                  transparent 60%
                ),
                var(--surface);
              padding: 30px 28px 24px;
              box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
              animation: pop 0.2s ease;
            }
            .x {
              position: absolute;
              top: 12px;
              right: 12px;
              width: 36px;
              height: 36px;
              border: none;
              border-radius: 10px;
              background: rgba(255, 255, 255, 0.06);
              color: #c3cad3;
              font-size: 22px;
              line-height: 1;
              cursor: pointer;
              transition: background 0.15s ease, color 0.15s ease;
            }
            .x:hover {
              background: rgba(255, 255, 255, 0.12);
              color: #fff;
            }
            .ic {
              font-size: 30px;
            }
            .badge {
              display: inline-block;
              margin-top: 12px;
              color: var(--gold);
              font-size: 11.5px;
              font-weight: 800;
              letter-spacing: 0.1em;
              text-transform: uppercase;
            }
            h3 {
              font-family: var(--display);
              font-size: 24px;
              font-weight: 700;
              letter-spacing: -0.02em;
              color: #fff;
              margin: 6px 0 0;
            }
            .sub {
              color: #c3cad3;
              font-size: 15px;
              line-height: 1.55;
              margin-top: 10px;
            }
            form {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 18px;
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
            form button {
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
            form button:active {
              transform: scale(0.97);
            }
            form button:disabled,
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
              margin-top: 18px;
              color: var(--accent);
              font-weight: 700;
              font-size: 16px;
            }
            @keyframes fade {
              from {
                opacity: 0;
              }
            }
            @keyframes pop {
              from {
                opacity: 0;
                transform: translateY(12px) scale(0.98);
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .ovl,
              .card {
                animation: none;
              }
            }
          `}</style>
        </div>
      )}
    </SignupModalContext.Provider>
  );
}
