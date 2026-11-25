"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Metric } from "@/content/profile";

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Counts up once when scrolled into view. Writes to the DOM directly — no re-renders per frame. */
export function MetricCounter({ metric, tone = "paper" }: { metric: Metric; tone?: "paper" | "panel" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const { value, decimals = 0, prefix = "", suffix = "", from } = metric;
  const final = `${prefix}${fmt(value, decimals)}${suffix}`;

  useEffect(() => {
    if (!seen || reduced || !ref.current) return;
    const el = ref.current;
    const controls = animate(from ?? 0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${prefix}${fmt(v, decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [seen, reduced, value, decimals, prefix, suffix, from]);

  const muted = tone === "panel" ? "text-panel-muted" : "text-muted";

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-2 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-none tracking-[-0.014em]">
        {from !== undefined && (
          <span className={`text-[0.5em] ${muted} line-through decoration-1`} aria-hidden>
            {fmt(from, decimals)}
          </span>
        )}
        <span ref={ref} className="tabular-nums">
          {final}
        </span>
      </div>
      <p className={`mt-2 text-[0.8125rem] leading-snug ${muted}`}>
        {metric.label}
        {from !== undefined && <span className="sr-only">, improved from {fmt(from, decimals)}{suffix}</span>}
      </p>
    </div>
  );
}
