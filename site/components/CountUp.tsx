"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  locale?: string;
  format?: (n: number) => string;
};

export default function CountUp({
  value,
  durationMs = 1400,
  prefix = "",
  suffix = "",
  className,
  locale = "da-DK",
  format,
}: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setDisplay(value);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) run();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    // Sikkerheds-fallback: hvis intersection aldrig udløses (fx visse
    // headless-/edge-tilfælde), så vis det rigtige tal alligevel.
    const fallback = window.setTimeout(() => {
      if (!started.current) setDisplay(value);
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format ? format(display) : display.toLocaleString(locale)}
      {suffix}
    </span>
  );
}
