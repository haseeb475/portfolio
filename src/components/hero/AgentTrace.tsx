"use client";

import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────
 *  A simulated replay of Coding Lambda's finite-state agent loop.
 *  It is illustrative (labelled as such in the UI) — tool names mirror the
 *  categories of tools the real agent uses, file names are fictional.
 * ───────────────────────────────────────────────────────────────────────── */

type StateId = "PLAN" | "RETRIEVE" | "EDIT" | "TEST" | "REFLECT" | "DONE";
type EdgeId = "p-r" | "r-e" | "e-t" | "t-x" | "x-r" | "t-d";
type LogKind = "run" | "plan" | "tool" | "exec" | "mem" | "done";
type Line = { kind: LogKind; msg: string; result?: { ok: boolean; text: string } };

const W = 74;
const H = 30;

const NODES: Record<StateId, { x: number; y: number }> = {
  PLAN: { x: 46, y: 40 },
  RETRIEVE: { x: 162, y: 40 },
  EDIT: { x: 278, y: 40 },
  TEST: { x: 394, y: 40 },
  REFLECT: { x: 278, y: 132 },
  DONE: { x: 394, y: 132 },
};

const EDGES: Record<EdgeId, { from: StateId; to: StateId; label?: string }> = {
  "p-r": { from: "PLAN", to: "RETRIEVE" },
  "r-e": { from: "RETRIEVE", to: "EDIT" },
  "e-t": { from: "EDIT", to: "TEST" },
  "t-x": { from: "TEST", to: "REFLECT", label: "fail" },
  "x-r": { from: "REFLECT", to: "RETRIEVE", label: "retry" },
  "t-d": { from: "TEST", to: "DONE", label: "pass" },
};

const STEPS: { state: StateId; edge: EdgeId | null; lines: Line[] }[] = [
  {
    state: "PLAN",
    edge: null,
    lines: [
      { kind: "run", msg: "lambda solve --issue parser-empty-header" },
      { kind: "plan", msg: "read issue → outline fix strategy" },
    ],
  },
  {
    state: "RETRIEVE",
    edge: "p-r",
    lines: [
      { kind: "tool", msg: 'ast.find_symbol("parse_header")' },
      { kind: "tool", msg: "semantic.search k=8 → 3 files" },
    ],
  },
  { state: "EDIT", edge: "r-e", lines: [{ kind: "tool", msg: "fs.apply_patch core/parser.py +6 −2" }] },
  {
    state: "TEST",
    edge: "e-t",
    lines: [{ kind: "exec", msg: "sandbox.run pytest -k header", result: { ok: false, text: "1 failed" } }],
  },
  { state: "REFLECT", edge: "t-x", lines: [{ kind: "mem", msg: "note: empty-header edge case" }] },
  { state: "RETRIEVE", edge: "x-r", lines: [{ kind: "tool", msg: "git.blame core/parser.py:118" }] },
  { state: "EDIT", edge: "r-e", lines: [{ kind: "tool", msg: "fs.apply_patch core/parser.py +3 −1" }] },
  {
    state: "TEST",
    edge: "e-t",
    lines: [{ kind: "exec", msg: "sandbox.run pytest", result: { ok: true, text: "48 passed" } }],
  },
  { state: "DONE", edge: "t-d", lines: [{ kind: "done", msg: "patch ready · guards: 0 loops wasted" }] },
];

const LAST = STEPS.length - 1;
const STEP_MS = 1150;
const HOLD_MS = 3200;

/** Point where the segment from a's centre toward b's centre leaves a's box (plus a small gap). */
function clip(a: { x: number; y: number }, b: { x: number; y: number }, gap = 5) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min((W / 2 + gap) / Math.abs(dx || 1e-6), (H / 2 + gap) / Math.abs(dy || 1e-6));
  return { x: a.x + dx * t, y: a.y + dy * t };
}

function edgeGeom(id: EdgeId) {
  const { from, to } = EDGES[id];
  const a = NODES[from];
  const b = NODES[to];
  return { p1: clip(a, b), p2: clip(b, a) };
}

const KIND_STYLE: Record<LogKind, string> = {
  run: "text-panel-muted",
  plan: "text-panel-ink",
  tool: "text-[#9cc7ff]",
  exec: "text-warn",
  mem: "text-[#d6a8ff]",
  done: "text-signal",
};

export function AgentTrace() {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  const running = visible && !reduced;
  const shown = reduced ? LAST : step;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => {
        if (step >= LAST) {
          setStep(0);
          setCycle((c) => c + 1);
        } else setStep((s) => s + 1);
      },
      step >= LAST ? HOLD_MS : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [running, step]);

  const visited = useMemo(() => {
    const states = new Set<StateId>();
    const edges = new Set<EdgeId>();
    for (let i = 0; i <= shown; i++) {
      states.add(STEPS[i].state);
      const e = STEPS[i].edge;
      if (e) edges.add(e);
    }
    return { states, edges };
  }, [shown]);

  const lines = useMemo(
    () =>
      STEPS.slice(0, shown + 1).flatMap((s, i) => s.lines.map((l, j) => ({ ...l, key: `${cycle}-${i}-${j}` }))),
    [shown, cycle],
  );

  const current = STEPS[shown];
  const activeEdge = current.edge ? edgeGeom(current.edge) : null;

  return (
    <div ref={root} className="relative">
      <p className="sr-only">
        Illustration: a replay of the Coding Lambda agent loop. The agent plans, retrieves code, edits, runs tests,
        reflects on a failing test, retries, and finishes with all tests passing.
      </p>

      {/* State machine */}
      <svg viewBox="0 0 440 166" className="block w-full" aria-hidden>
        <defs>
          <marker id="at-arrow-on" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--signal)" fillOpacity={0.7} />
          </marker>
          <marker id="at-arrow-off" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--panel-rule)" />
          </marker>
        </defs>

        {(Object.keys(EDGES) as EdgeId[]).map((id) => {
          const { p1, p2 } = edgeGeom(id);
          const on = visited.edges.has(id);
          const label = EDGES[id].label;
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          return (
            <g key={id} className={cn("transition-colors duration-500", on ? "text-signal/70" : "text-panel-rule")}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="currentColor"
                strokeWidth={1.25}
                strokeDasharray={on ? undefined : "3 4"}
                markerEnd={on ? "url(#at-arrow-on)" : "url(#at-arrow-off)"}
              />
              {label && (
                <text
                  x={mx + (id === "t-d" ? 8 : id === "x-r" ? -10 : 8)}
                  y={my + (id === "t-d" ? 3 : -4)}
                  textAnchor={id === "x-r" ? "end" : "start"}
                  className="fill-panel-muted font-mono text-[8.5px] tracking-wider"
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}

        {(Object.keys(NODES) as StateId[]).map((id) => {
          const { x, y } = NODES[id];
          const active = current.state === id;
          const seen = visited.states.has(id);
          return (
            <g key={id}>
              {active && (
                <m.rect
                  x={x - W / 2 - 4}
                  y={y - H / 2 - 4}
                  width={W + 8}
                  height={H + 8}
                  rx={9}
                  fill="none"
                  stroke="var(--signal)"
                  strokeOpacity={0.35}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                  transition={{ duration: 0.4, ease: ease.outExpo }}
                />
              )}
              <rect
                x={x - W / 2}
                y={y - H / 2}
                width={W}
                height={H}
                rx={6}
                className="transition-all duration-500"
                fill={active ? "var(--signal-soft)" : "var(--panel-2)"}
                stroke={active ? "var(--signal)" : seen ? "rgb(233 231 223 / 0.35)" : "var(--panel-rule)"}
                strokeWidth={1}
              />
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                className={cn(
                  "font-mono text-[10px] tracking-[0.12em] transition-colors duration-500",
                  active ? "fill-signal" : seen ? "fill-panel-ink" : "fill-panel-muted",
                )}
              >
                {id}
              </text>
            </g>
          );
        })}

        {/* Travelling packet */}
        {activeEdge && !reduced && (
          <m.circle
            key={`${cycle}-${shown}`}
            r={3.5}
            fill="var(--signal)"
            initial={{ cx: activeEdge.p1.x, cy: activeEdge.p1.y, opacity: 1 }}
            animate={{ cx: activeEdge.p2.x, cy: activeEdge.p2.y, opacity: [1, 1, 0] }}
            transition={{ duration: 0.55, ease: ease.inOutQuart }}
          />
        )}
      </svg>

      {/* Log stream */}
      <div className="border-t border-panel-rule px-4 py-3 font-mono text-[11px] leading-[1.7] sm:text-xs" aria-hidden>
        <div className="flex h-[calc(1.7em*4)] flex-col justify-end overflow-hidden sm:h-[calc(1.7em*6)]">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <m.div
                key={l.key}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: ease.outExpo }}
                className="flex min-w-0 gap-3 whitespace-nowrap"
              >
                <span className={cn("w-9 shrink-0", KIND_STYLE[l.kind])}>{l.kind === "run" ? "$" : l.kind}</span>
                <span className="truncate text-panel-ink/85">{l.msg}</span>
                {l.result && (
                  <span className={cn("ml-auto shrink-0 pl-2", l.result.ok ? "text-signal" : "text-[#ff7a6b]")}>
                    {l.result.ok ? "✓" : "✗"} {l.result.text}
                  </span>
                )}
              </m.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-1 flex items-center gap-2 text-panel-muted">
          <span className="text-signal">›</span>
          <span>{shown === LAST ? "fixed. waiting for the next issue" : `state: ${current.state.toLowerCase()}`}</span>
          <span className="caret inline-block h-3 w-1.5 bg-panel-muted" />
        </div>
      </div>
    </div>
  );
}

/** Small status readout for the panel header. */
export function TraceStatus() {
  return (
    <span className="flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-signal" aria-hidden />
      replay
    </span>
  );
}
