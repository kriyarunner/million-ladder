"use client";

import { useEffect, useRef } from "react";

type Coin = {
  x: number;
  y: number;
  r: number;
  sp: number;
  dx: number;
  rot: number;
  rs: number;
  a: number;
};

/**
 * Subtil, premium guld-regn på canvas.
 * variant="fixed"  -> dækker hele vinduet (bruges på coming-soon)
 * variant="absolute" -> fylder forælder-elementet (bruges i hero)
 */
export default function CoinFall({
  variant = "fixed",
}: {
  variant?: "fixed" | "absolute";
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let coins: Coin[] = [];
    let raf = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    const R = (a: number, b: number) => a + Math.random() * (b - a);

    const size = () => {
      if (variant === "fixed") {
        w = c.width = Math.max(1, window.innerWidth * dpr);
        h = c.height = Math.max(1, window.innerHeight * dpr);
      } else {
        const parent = c.parentElement as HTMLElement;
        const r = parent.getBoundingClientRect();
        w = c.width = Math.max(1, r.width * dpr);
        h = c.height = Math.max(1, r.height * dpr);
      }
    };

    const mk = (top: boolean): Coin => ({
      x: R(0, w),
      y: top ? R(-h * 0.3, 0) : R(-h, h),
      r: R(6, 13) * dpr,
      sp: R(0.35, 0.95) * dpr,
      dx: R(-0.25, 0.25) * dpr,
      rot: R(0, Math.PI * 2),
      rs: R(0.015, 0.05),
      a: R(0.16, 0.5),
    });

    const init = () => {
      size();
      const max = variant === "fixed" ? 50 : 44;
      const n = Math.min(max, Math.floor(w / (32 * dpr)));
      coins = Array.from({ length: n }, () => mk(false));
    };

    const coin = (co: Coin) => {
      const ww = Math.max(1.5, Math.abs(Math.cos(co.rot)) * co.r);
      ctx.save();
      ctx.translate(co.x, co.y);
      ctx.globalAlpha = co.a;
      const g = ctx.createLinearGradient(0, -co.r, 0, co.r);
      g.addColorStop(0, "#ffe9a8");
      g.addColorStop(0.5, "#ffcf4a");
      g.addColorStop(1, "#d99a17");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, ww, co.r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = Math.max(1, co.r * 0.12);
      ctx.strokeStyle = "rgba(182,133,15,.55)";
      ctx.stroke();
      if (ww > co.r * 0.5) {
        ctx.globalAlpha = co.a * 0.6;
        ctx.fillStyle = "rgba(255,243,207,.8)";
        ctx.beginPath();
        ctx.ellipse(-ww * 0.25, -co.r * 0.3, ww * 0.28, co.r * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const co of coins) {
        co.y += co.sp;
        co.x += co.dx;
        co.rot += co.rs;
        if (co.y > h + 20) Object.assign(co, mk(true));
        coin(co);
      }
      raf = requestAnimationFrame(frame);
    };

    init();
    frame();

    const onResize = () => {
      if (t) clearTimeout(t);
      t = setTimeout(init, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      if (t) clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [variant]);

  return (
    <canvas
      ref={ref}
      className={variant === "fixed" ? "coinfall-fixed" : "coinfall-abs"}
      aria-hidden="true"
    />
  );
}
