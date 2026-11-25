"use client";

import { m } from "motion/react";
import { useId } from "react";
import { ease, inView } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────
 *  Tiny declarative diagram engine: nodes, groups and elbow-routed edges.
 *  Specs live in ./specs.ts so diagrams are data, not hand-drawn SVG.
 * ───────────────────────────────────────────────────────────────────────── */

export type Side = "top" | "right" | "bottom" | "left";

export type DNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  sub?: string;
  tone?: "base" | "accent" | "ghost";
};

export type DEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  /** Animated flow along the edge once drawn. */
  flow?: boolean;
  fromSide?: Side;
  toSide?: Side;
  /** Explicit SVG path, overrides routing. */
  d?: string;
  labelAt?: { x: number; y: number };
};

export type DGroup = { x: number; y: number; w: number; h: number; label: string; /** label start x (defaults to the left edge) */ labelX?: number };

export type DiagramSpec = {
  width: number;
  height: number;
  nodes: DNode[];
  edges: DEdge[];
  groups?: DGroup[];
};

const DEFAULT_H = 54;

type Pt = { x: number; y: number };

function anchor(n: DNode, side: Side): Pt {
  const h = n.h ?? DEFAULT_H;
  switch (side) {
    case "top":
      return { x: n.x + n.w / 2, y: n.y };
    case "bottom":
      return { x: n.x + n.w / 2, y: n.y + h };
    case "left":
      return { x: n.x, y: n.y + h / 2 };
    case "right":
      return { x: n.x + n.w, y: n.y + h / 2 };
  }
}

function route(a: DNode, b: DNode, e: DEdge): { d: string; mid: Pt; vertical: boolean } {
  const r = routePath(a, b, e);
  return { ...r, vertical: /^M[\d.]+ [\d.]+ V[\d.]+$/.test(r.d) };
}

function routePath(a: DNode, b: DNode, e: DEdge): { d: string; mid: Pt } {
  const overlapX = a.x < b.x + b.w && b.x < a.x + a.w;
  const horizontal = e.fromSide
    ? e.fromSide === "left" || e.fromSide === "right"
    : !overlapX && Math.abs(b.x + b.w / 2 - (a.x + a.w / 2)) > 0;

  const fromSide: Side =
    e.fromSide ?? (horizontal ? (b.x > a.x ? "right" : "left") : b.y > a.y ? "bottom" : "top");
  const toSide: Side =
    e.toSide ?? (horizontal ? (b.x > a.x ? "left" : "right") : b.y > a.y ? "top" : "bottom");

  const p = anchor(a, fromSide);
  const q = anchor(b, toSide);

  if (fromSide === "left" || fromSide === "right") {
    if (Math.abs(p.y - q.y) < 0.5) return { d: `M${p.x} ${p.y} H${q.x}`, mid: { x: (p.x + q.x) / 2, y: p.y } };
    if (toSide === "top" || toSide === "bottom") {
      return { d: `M${p.x} ${p.y} H${q.x} V${q.y}`, mid: { x: (p.x + q.x) / 2, y: p.y } };
    }
    const mx = (p.x + q.x) / 2;
    return { d: `M${p.x} ${p.y} H${mx} V${q.y} H${q.x}`, mid: { x: mx, y: (p.y + q.y) / 2 } };
  }
  if (Math.abs(p.x - q.x) < 0.5) return { d: `M${p.x} ${p.y} V${q.y}`, mid: { x: p.x, y: (p.y + q.y) / 2 } };
  if (toSide === "left" || toSide === "right") {
    return { d: `M${p.x} ${p.y} V${q.y} H${q.x}`, mid: { x: p.x, y: (p.y + q.y) / 2 } };
  }
  const my = (p.y + q.y) / 2;
  return { d: `M${p.x} ${p.y} V${my} H${q.x} V${q.y}`, mid: { x: (p.x + q.x) / 2, y: my } };
}

type Props = { spec: DiagramSpec; title: string; className?: string };

export function Diagram({ spec, title, className }: Props) {
  const uid = useId().replace(/:/g, "");
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const edges = spec.edges.map((e) => {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) throw new Error(`Diagram edge ${e.from}→${e.to} references a missing node`);
    const r = e.d ? { d: e.d, mid: e.labelAt ?? { x: 0, y: 0 }, vertical: false } : route(a, b, e);
    return { ...e, ...r, mid: e.labelAt ?? r.mid };
  });

  const nodeDelay = (i: number) => 0.1 + i * 0.05;
  const edgeDelay = (i: number) => 0.35 + i * 0.07;

  return (
    <div className={cn("relative", className)}>
      <div className="no-scrollbar -mx-px overflow-x-auto">
        <m.svg
          viewBox={`0 0 ${spec.width} ${spec.height}`}
          className="block h-auto w-full min-w-[620px]"
          role="img"
          aria-label={title}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <defs>
            <marker id={`${uid}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="rgb(233 231 223 / 0.55)" />
            </marker>
          </defs>

          {spec.groups?.map((g, i) => (
            <m.g
              key={`g${i}`}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 0.05 } } }}
            >
              <rect
                x={g.x}
                y={g.y}
                width={g.w}
                height={g.h}
                rx={10}
                fill="rgb(255 255 255 / 0.015)"
                stroke="var(--panel-rule)"
                strokeDasharray="4 5"
              />
              <rect x={(g.labelX ?? g.x + 12)} y={g.y - 7} width={g.label.length * 5.9 + 14} height={14} fill="var(--panel)" />
              <text x={(g.labelX ?? g.x + 12) + 7} y={g.y + 3} className="fill-panel-muted font-mono text-[9px] tracking-[0.12em] uppercase">
                {g.label}
              </text>
            </m.g>
          ))}

          {edges.map((e, i) => (
            <g key={`e${i}`}>
              <m.path
                d={e.d}
                fill="none"
                stroke="rgb(233 231 223 / 0.4)"
                strokeWidth={1.1}
                strokeDasharray={e.dashed ? "3 4" : undefined}
                markerEnd={`url(#${uid}-a)`}
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  show: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { pathLength: { duration: 0.9, ease: ease.inOutQuart, delay: edgeDelay(i) }, opacity: { duration: 0.01, delay: edgeDelay(i) } },
                  },
                }}
              />
              {e.flow && (
                <m.path
                  d={e.d}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeDasharray="2 22"
                  className="diagram-flow"
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 0.9, transition: { delay: edgeDelay(i) + 0.9 } } }}
                />
              )}
              {e.label && (
                <m.text
                  x={e.vertical ? e.mid.x + 7 : e.mid.x}
                  y={e.vertical ? e.mid.y + 3 : e.mid.y - 6}
                  textAnchor={e.vertical ? "start" : "middle"}
                  className="fill-panel-muted font-mono text-[9px] tracking-wider"
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: edgeDelay(i) + 0.6 } } }}
                >
                  {e.label}
                </m.text>
              )}
            </g>
          ))}

          {spec.nodes.map((n, i) => {
            const h = n.h ?? DEFAULT_H;
            const accent = n.tone === "accent";
            const ghost = n.tone === "ghost";
            return (
              <m.g
                key={n.id}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.outExpo, delay: nodeDelay(i) } },
                }}
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={h}
                  rx={7}
                  fill={accent ? "var(--signal-soft)" : "var(--panel-2)"}
                  stroke={accent ? "var(--signal)" : "var(--panel-rule)"}
                  strokeOpacity={accent ? 0.7 : 1}
                  strokeDasharray={ghost ? "3 4" : undefined}
                />
                <text
                  x={n.x + 12}
                  y={n.y + (n.sub ? h / 2 - 3 : h / 2 + 4)}
                  className={cn("font-sans text-[12px] font-medium", accent ? "fill-signal" : "fill-panel-ink")}
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text x={n.x + 12} y={n.y + h / 2 + 13} className="fill-panel-muted font-mono text-[9px] tracking-wide">
                    {n.sub}
                  </text>
                )}
              </m.g>
            );
          })}
        </m.svg>
      </div>
      <p className="label-mono border-t border-panel-rule px-4 py-2.5 text-panel-muted md:hidden" aria-hidden>
        ← Swipe to explore →
      </p>
    </div>
  );
}
