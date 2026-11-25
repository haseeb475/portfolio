"use client";

import { m, useInView, useReducedMotion, type Variants } from "motion/react";
import { useRef, useState } from "react";
import { beyond, type Pastime } from "@/content/profile";
import { SplitWords } from "@/components/ui/SplitWords";
import { BeamGradient, CarShape } from "@/components/ui/RallyCar";
import { useFinePointer } from "@/lib/useFinePointer";
import { cn } from "@/lib/cn";
import { formatMonth } from "@/lib/dates";

/* ─────────────────────────────────────────────────────────────────────────
 *  "The weekend logbook": taped-in scrapbook cards with hand-drawn doodles.
 *  Each doodle plays a tiny animation on hover (or when scrolled into view
 *  on touch screens). Variants "rest" → "play" flow from the card down.
 * ───────────────────────────────────────────────────────────────────────── */

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const TILTS = [-1.6, 1.3, -0.9, 1.5, -1.2, 0.8];

const ink = { stroke: "var(--ink)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
const soft = { ...ink, stroke: "var(--muted)", strokeWidth: 1.4 };
const box = { transformBox: "fill-box" as const, transformOrigin: "center" };
const spring = { type: "spring" as const, stiffness: 120, damping: 14 };

/* ───────────── Doodles (viewBox 240 × 120) ───────────── */

function Football() {
  return (
    <>
      <path d="M8 102 H232" {...soft} />
      {[30, 70, 118, 150].map((x) => (
        <path key={x} d={`M${x} 102 l3 -6 M${x + 6} 102 l-2 -7`} {...soft} />
      ))}
      {/* goal + net */}
      <path d="M186 102 V46 H232" {...ink} />
      {[56, 68, 80, 92].map((y) => (
        <path key={y} d={`M186 ${y} H232`} {...soft} strokeDasharray="2 4" />
      ))}
      {[198, 210, 222].map((x) => (
        <path key={x} d={`M${x} 46 V102`} {...soft} strokeDasharray="2 4" />
      ))}
      <m.g
        style={box}
        variants={{ rest: { x: 0, rotate: 0 }, play: { x: 150, rotate: 540, transition: { duration: 1, ease: [0.2, 0.7, 0.3, 1] } } }}
      >
        <circle cx={40} cy={88} r={13} fill="var(--paper)" {...{ stroke: "var(--ink)", strokeWidth: 2 }} />
        <path d="M40 82 l5 3.5 -2 6 h-6 l-2 -6 z" fill="var(--ink)" />
        <path d="M40 82 V75 M45 85.5 l6 -2.5 M43 91.5 l4 5 M37 91.5 l-4 5 M35 85.5 l-6 -2.5" {...ink} strokeWidth={1.2} />
      </m.g>
    </>
  );
}

function Volleyball() {
  return (
    <>
      <path d="M8 104 H232" {...soft} />
      <path d="M120 104 V44" {...ink} strokeWidth={3} />
      <rect x={108} y={44} width={24} height={26} fill="none" stroke="var(--muted)" strokeWidth={1} strokeDasharray="2 3" />
      <path d="M104 44 H136" {...ink} />
      <m.g
        style={box}
        variants={{
          rest: { x: 0, y: 0, rotate: 0 },
          play: { x: [0, 70, 136], y: [0, -66, 0], rotate: 360, transition: { duration: 1.1, ease: "easeInOut" } },
        }}
      >
        <circle cx={44} cy={90} r={12} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
        <path d="M33 86 Q44 92 55 86 M38 80 Q42 90 37 100 M50 80 Q46 90 51 100" {...ink} strokeWidth={1.2} />
      </m.g>
      <m.path
        d="M44 78 Q114 0 180 78"
        {...soft}
        strokeDasharray="3 5"
        variants={{ rest: { opacity: 0 }, play: { opacity: [0, 0.8, 0], transition: { duration: 1.1 } } }}
      />
    </>
  );
}

function Hiking() {
  return (
    <>
      <path d="M8 106 L66 44 L96 74 L140 22 L232 106 Z" fill="var(--paper)" {...{ stroke: "var(--ink)", strokeWidth: 2, strokeLinejoin: "round" as const }} />
      <path d="M128 36 L140 22 L152 36 L146 33 L140 38 L134 33 Z" fill="var(--ink)" opacity={0.85} />
      <path d="M166 106 Q190 92 214 106" {...soft} />
      <m.path
        d="M26 104 C 56 100, 48 88, 74 86 S 104 80, 100 70 S 122 52, 126 44 S 134 30, 140 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray="1 6"
        variants={{ rest: { pathLength: 0.3 }, play: { pathLength: 1, transition: { duration: 1.2, ease: "easeInOut" } } }}
      />
      <m.g style={box} variants={{ rest: { scale: 0, opacity: 0 }, play: { scale: 1, opacity: 1, transition: { delay: 1, ...spring } } }}>
        <path d="M140 22 V2" {...ink} />
        <path d="M140 3 L156 8 L140 13 Z" fill="var(--accent)" />
      </m.g>
    </>
  );
}

/** A tilted globe that turns slowly on its own. Routes arc above the surface and light up on hover / in view. */
const G = { cx: 150, cy: 150, r: 104 };
const MERIDIANS = 6;
const SPIN_STEPS = 24;

function meridianRx(phase: number) {
  return Array.from({ length: SPIN_STEPS + 1 }, (_, k) => {
    const a = phase + (k / SPIN_STEPS) * Math.PI;
    return Math.abs(Math.cos(a)) * G.r;
  });
}

function VolunteerGlobe() {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  // Only spin while on screen: saves battery on phones.
  const visible = useInView(ref, { margin: "100px" });
  const spin = !reduced && visible;
  // Places on the visible face of the globe, and the routes between them (arcing above the surface).
  const spots: [number, number][] = [
    [104, 112],
    [196, 96],
    [182, 196],
    [116, 204],
  ];
  const routes = [
    "M104 112 Q146 20 196 96",
    "M196 96 Q276 150 182 196",
    "M182 196 Q152 282 116 204",
    "M116 204 Q26 156 104 112",
  ];
  return (
    <svg ref={ref} viewBox="0 0 300 300" className="block h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <clipPath id="vg-clip">
          <circle cx={G.cx} cy={G.cy} r={G.r} />
        </clipPath>
        <radialGradient id="vg-shade" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="var(--paper)" />
          <stop offset="1" stopColor="var(--paper-2)" />
        </radialGradient>
      </defs>

      <ellipse cx={G.cx} cy={G.cy + G.r + 22} rx={G.r * 0.75} ry={8} fill="var(--ink)" opacity={0.08} />
      <circle cx={G.cx} cy={G.cy} r={G.r} fill="url(#vg-shade)" />

      <g clipPath="url(#vg-clip)">
        {/* latitude lines (tilted view) */}
        {[-0.66, -0.33, 0, 0.33, 0.66].map((t) => {
          const y = G.cy + t * G.r;
          const rx = Math.sqrt(1 - t * t) * G.r;
          return <ellipse key={t} cx={G.cx} cy={y} rx={rx} ry={rx * 0.16} fill="none" stroke="var(--rule)" strokeWidth={1.2} />;
        })}
        {/* meridians, turning */}
        {Array.from({ length: MERIDIANS }, (_, i) => {
          const phase = (i / MERIDIANS) * Math.PI;
          const frames = meridianRx(phase);
          return (
            <m.ellipse
              key={i}
              cx={G.cx}
              cy={G.cy}
              ry={G.r}
              fill="none"
              stroke="var(--rule)"
              strokeWidth={1.2}
              initial={{ rx: frames[0] }}
              animate={spin ? { rx: frames } : undefined}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
          );
        })}
      </g>
      <circle cx={G.cx} cy={G.cy} r={G.r} fill="none" stroke="var(--ink)" strokeWidth={1.8} />

      {routes.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="var(--muted)" strokeWidth={1.3} strokeDasharray="3 5" strokeLinecap="round" opacity={0.7} />
          <m.path
            d={d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.4}
            strokeLinecap="round"
            variants={{ rest: { pathLength: 0, opacity: 0 }, play: { pathLength: 1, opacity: 1, transition: { duration: 0.8, delay: i * 0.22 } } }}
          />
        </g>
      ))}

      {spots.map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <m.circle
            cx={x}
            cy={y}
            r={5}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            style={box}
            variants={{
              rest: { scale: 1, opacity: 0 },
              play: { scale: [1, 3.2], opacity: [0.7, 0], transition: { duration: 1.1, delay: 0.2 + i * 0.22 } },
            }}
          />
          <circle cx={x} cy={y} r={5} fill="var(--accent)" stroke="var(--paper)" strokeWidth={2} />
        </g>
      ))}
    </svg>
  );
}

/** Boarding pass for the volunteering card: AIESEC's outgoing program sends students abroad. */
const BARCODE = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];

function BoardingPass({ since, className }: { since: string; className?: string }) {
  return (
    <m.div
      variants={{ rest: { rotate: 2.5 }, play: { rotate: 0, transition: { type: "spring", stiffness: 220, damping: 18 } } }}
      className={cn(
        "overflow-hidden rounded-2xl bg-paper shadow-[0_22px_44px_-26px_rgb(0_0_0/0.45)] ring-1 ring-rule",
        className,
      )}
      role="img"
      aria-label="A boarding pass: from Passau to anywhere. Passengers: students. Program: Global Volunteer."
    >
      <div className="flex items-center justify-between bg-accent px-4 py-2 text-paper">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">Boarding pass</span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">AIESEC</span>
      </div>

      <div className="px-4 pb-4 pt-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="label-mono text-muted">From</p>
            <p className="font-display text-[1.6rem] leading-none">Passau</p>
          </div>
          <div>
            <p className="label-mono text-right text-muted">To</p>
            <p className="font-display text-[1.6rem] italic leading-none text-accent">Anywhere</p>
          </div>
        </div>

        {/* flight path */}
        <div className="relative mt-3 h-6">
          <span aria-hidden className="absolute inset-x-1 top-1/2 border-t border-dashed border-muted" />
          <span aria-hidden className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-ink" />
          <span aria-hidden className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-accent bg-paper" />
          <m.span
            aria-hidden
            className="absolute top-1/2 -mt-[9px] block text-[18px] leading-none text-ink"
            variants={{
              rest: { left: "8%" },
              play: { left: "84%", transition: { duration: 1.3, ease: [0.45, 0, 0.2, 1] } },
            }}
          >
            ✈
          </m.span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {[
            ["Passenger", "Students"],
            ["Program", "Global Volunteer"],
            ["Team lead", "Haseeb R."],
            ["Since", since],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label-mono text-muted">{k}</dt>
              <dd className="mt-1 text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* perforation with ticket notches */}
      <div className="relative">
        <span aria-hidden className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-paper-2" />
        <span aria-hidden className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-paper-2" />
        <span aria-hidden className="mx-4 block border-t border-dashed border-rule" />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span aria-hidden className="flex h-8 items-stretch gap-[2px]">
          {BARCODE.map((w, i) => (
            <span key={i} className="bg-ink" style={{ width: w }} />
          ))}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">One way · OGV</span>
      </div>
    </m.div>
  );
}

function Cars() {
  return (
    <>
      <defs>
        <BeamGradient id="beam-logbook" />
      </defs>
      <path d="M8 96 H232" stroke="var(--rule)" strokeWidth={22} strokeLinecap="round" />
      <path d="M8 96 H232" stroke="var(--paper)" strokeWidth={1.4} strokeDasharray="8 8" />
      <m.g variants={{ rest: { x: 0 }, play: { x: 140, transition: { duration: 1.1, ease: [0.5, 0, 0.2, 1] } } }}>
        {[0, 1, 2].map((i) => (
          <m.circle
            key={i}
            cx={20 - i * 10}
            cy={96 + (i % 2 ? 3 : -3)}
            r={4 + i * 2}
            fill="var(--muted)"
            variants={{ rest: { opacity: 0 }, play: { opacity: [0, 0.45 - i * 0.12, 0], transition: { duration: 1.1 } } }}
          />
        ))}
        <g transform="translate(46 96) scale(1.45)">
          <CarShape beamId="beam-logbook" />
        </g>
      </m.g>
      <path d="M200 40 l10 -12 10 12 z" fill="none" stroke="var(--muted)" strokeWidth={1.4} />
      <path d="M210 28 V74" {...soft} />
    </>
  );
}

function Tech() {
  return (
    <>
      <rect x={58} y={14} width={124} height={78} rx={7} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
      <path d="M104 92 L98 106 H142 L136 92" {...ink} />
      <path d="M90 106 H150" {...ink} />
      <m.path
        d="M112 38 L134 52 L112 66 Z"
        fill="var(--accent)"
        style={box}
        variants={{ rest: { scale: 1 }, play: { scale: [1, 1.25, 1], transition: { duration: 0.5 } } }}
      />
      <rect x={70} y={80} width={100} height={4} rx={2} fill="var(--rule)" />
      <m.rect
        x={70}
        y={80}
        height={4}
        rx={2}
        fill="var(--accent)"
        variants={{ rest: { width: 28 }, play: { width: 100, transition: { duration: 1.2, ease: "easeInOut" } } }}
      />
      <m.g style={box} variants={{ rest: { scale: 0, rotate: -30 }, play: { scale: 1, rotate: 0, transition: { delay: 1.1, ...spring } } }}>
        <path d="M200 26 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="var(--accent)" />
      </m.g>
      <path d="M30 40 l8 -4 M28 54 h9 M30 68 l8 4" {...soft} />
    </>
  );
}

function German() {
  return (
    <>
      <path d="M40 22 H200 Q212 22 212 34 V72 Q212 84 200 84 H92 L70 102 L74 84 H40 Q28 84 28 72 V34 Q28 22 40 22 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      <m.text
        x={120}
        y={62}
        textAnchor="middle"
        className="fill-ink font-display text-[26px] italic"
        variants={{ rest: { opacity: 1, y: 0 }, play: { opacity: 0, y: -8, transition: { duration: 0.25 } } }}
      >
        Hallo!
      </m.text>
      <m.text
        x={120}
        y={62}
        textAnchor="middle"
        className="fill-accent font-display text-[26px] italic"
        variants={{ rest: { opacity: 0, y: 8 }, play: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } } }}
      >
        Wie geht&apos;s?
      </m.text>
      <g transform="translate(176 92)">
        <rect width={36} height={6} fill="#1b1c19" />
        <rect y={6} width={36} height={6} fill="#d03b2f" />
        <rect y={12} width={36} height={6} fill="#f2c230" />
        <rect width={36} height={18} fill="none" stroke="var(--rule)" strokeWidth={1} />
      </g>
    </>
  );
}

const DOODLES: Record<Pastime, () => React.ReactElement> = {
  football: Football,
  volleyball: Volleyball,
  hiking: Hiking,
  cars: Cars,
  tech: Tech,
  german: German,
};

const DOODLE_LABELS: Record<Pastime, string> = {
  football: "A doodle of a football rolling into a goal",
  volleyball: "A doodle of a volleyball going over a net",
  hiking: "A doodle of a hiking trail leading up a mountain to a flag",
  tech: "A doodle of a screen playing a video, with the progress bar filling up",
  cars: "A doodle of a rally car driving along a road",
  german: "A doodle of a speech bubble saying Hallo",
};

/* ───────────── Logbook card: front = doodle, back = sticky note ───────────── */

type Item = (typeof beyond.items)[number];

function LogCard({ item: it, index: i, fine, variants }: { item: Item; index: number; fine: boolean; variants: Variants }) {
  const [open, setOpen] = useState(false);
  const Doodle = DOODLES[it.id];
  const toggle = () => setOpen((o) => !o);

  return (
    <m.article
      initial="rest"
      whileHover="play"
      {...(fine ? {} : { whileInView: "play", viewport: { amount: 0.7, once: false } })}
      variants={variants}
      onClick={toggle}
      className="relative h-full cursor-pointer [perspective:1400px]"
    >
      <m.div
        className="relative grid h-full [transform-style:preserve-3d]"
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 17 }}
      >
        {/* Front */}
        <div
          inert={open}
          className="relative col-start-1 row-start-1 flex h-full flex-col rounded-[14px] bg-paper p-4 pb-4 shadow-[0_18px_40px_-26px_rgb(0_0_0/0.35)] ring-1 ring-rule [backface-visibility:hidden]"
        >
          <span
            aria-hidden
            className={cn(
              "absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rounded-[3px] bg-accent/15 ring-1 ring-accent/10 backdrop-blur-[1px]",
              i % 2 ? "rotate-3" : "-rotate-2",
            )}
          />
          <div className="overflow-hidden rounded-[10px] bg-paper-2">
            <svg viewBox="0 0 240 120" className="block h-auto w-full" role="img" aria-label={DOODLE_LABELS[it.id]}>
              <Doodle />
            </svg>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-3 px-1">
            <h4 className="font-display text-[1.6rem] italic leading-none">{it.title}</h4>
            <span className="label-mono shrink-0 text-muted">{it.tag}</span>
          </div>
          <p className="mt-3 px-1 text-[0.9375rem] leading-relaxed text-ink-2">{it.body}</p>

          {it.id === "german" && (
            <ul className="mt-4 space-y-2 px-1">
              {beyond.languages.map((l) => {
                const level = CEFR.indexOf(l.level as (typeof CEFR)[number]);
                return (
                  <li key={l.name} className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <span>{l.name}</span>
                    <span className="grid grid-cols-6 gap-1" role="img" aria-label={`CEFR level ${l.level}`}>
                      {CEFR.map((c, ci) => (
                        <span key={c} className={cn("h-1.5 rounded-full", ci <= level ? "bg-accent" : "bg-rule")} />
                      ))}
                    </span>
                    <span className="font-mono text-xs text-muted">{l.level}</span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 px-1 pt-4">
            <p className="-rotate-2 font-hand text-[1.35rem] leading-none text-accent">↳ {it.note}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              aria-expanded={open}
              aria-label={`Open the note about ${it.title}`}
              className="group/btn inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-rule bg-paper px-3 font-mono text-[0.6875rem] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <span aria-hidden className="inline-block transition-transform duration-500 group-hover/btn:rotate-180">↻</span>
              open note
            </button>
          </div>
        </div>

        {/* Back: the sticky note */}
        <div
          inert={!open}
          className="relative col-start-1 row-start-1 flex h-full flex-col rounded-[4px] bg-note p-6 pt-8 text-note-ink shadow-[0_20px_40px_-24px_rgb(0_0_0/0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          {/* push pin */}
          <span aria-hidden className="absolute left-1/2 top-3 size-3.5 -translate-x-1/2 rounded-full bg-[#d0473a] shadow-[0_2px_3px_rgb(0_0_0/0.35)]" />
          {/* folded corner */}
          <span
            aria-hidden
            className="absolute bottom-0 right-0 size-9 rounded-tl-[6px] bg-[linear-gradient(315deg,var(--paper-2)_50%,rgb(0_0_0/0.14)_50%)]"
          />

          <p className="font-hand text-[1.9rem] leading-none">{it.title}, off the record</p>
          <ul className="mt-5 space-y-3.5">
            {it.secret.map((line) => (
              <li key={line} className="flex gap-2.5 font-hand text-[1.4rem] leading-[1.15]">
                <span aria-hidden>✎</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="mt-auto inline-flex min-h-10 w-fit items-center gap-1.5 pt-4 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-note-ink/70 transition-colors hover:text-note-ink"
          >
            <span aria-hidden>↺</span> flip back
          </button>
        </div>
      </m.div>
    </m.article>
  );
}

/* ───────────── Section ───────────── */

export function Beyond() {
  const fine = useFinePointer();

  const card = (tilt: number): Variants => ({
    rest: { rotate: tilt, y: 0 },
    play: { rotate: 0, y: -6, transition: { type: "spring", stiffness: 260, damping: 20 } },
  });

  return (
    <section aria-labelledby="beyond-h" className="page-x py-20 md:py-36">
      <div className="label-mono flex items-center gap-4 text-muted">
        <span>§05</span>
        <span className="h-px flex-1 bg-rule" aria-hidden />
        <span>Outside of work</span>
      </div>

      <SplitWords
        id="beyond-h"
        text={beyond.title}
        className="mt-8 font-display text-[clamp(2.3rem,4.8vw,4.4rem)] leading-[1.04] tracking-[-0.014em]"
      />

      {/* Giving back: a role, not a hobby */}
      <h3 className="label-mono mt-14 text-muted">Giving back</h3>
      <m.article
        initial="rest"
        whileHover="play"
        whileInView={fine ? undefined : "play"}
        viewport={{ amount: 0.6, once: true }}
        className="mt-4 grid items-center gap-8 rounded-2xl border border-rule border-l-4 border-l-accent bg-paper-2 p-6 md:grid-cols-[1fr_19rem] md:gap-10 md:p-8"
      >
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-paper">
              Volunteering
            </span>
            <span className="label-mono text-muted">
              Since {formatMonth(beyond.volunteering.start)} · {beyond.volunteering.location}
            </span>
          </div>
          <p className="mt-4 font-display text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.05]">{beyond.volunteering.org}</p>
          <p className="mt-1.5 text-ink-2">{beyond.volunteering.role}</p>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-ink-2">{beyond.volunteering.body}</p>
          <p className="mt-4 max-w-[62ch] font-display text-[1.15rem] italic leading-snug text-ink">{beyond.volunteering.why}</p>
        </div>
        {beyond.volunteering.visual === "globe" ? (
          <div className="mx-auto w-full max-w-[17rem]">
            <VolunteerGlobe />
          </div>
        ) : (
          <BoardingPass since={formatMonth(beyond.volunteering.start)} className="mx-auto w-full max-w-[19rem]" />
        )}
      </m.article>

      {/* The fun stuff */}
      <div className="mt-16 flex flex-wrap items-end justify-between gap-x-12 gap-y-2">
        <h3 className="label-mono text-muted">The weekend logbook</h3>
        <p className="font-hand text-[1.6rem] leading-tight text-accent md:-rotate-2">{beyond.intro}</p>
      </div>

      <p className="mt-6 font-hand text-[1.25rem] text-muted" aria-hidden>
        <span className="sm:hidden">swipe for more, tap a card to open its note</span>
        <span className="hidden sm:inline">click a card to open its note</span>
      </p>
      <ul className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 pt-4 sm:mx-0 sm:mt-10 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-7 sm:gap-y-10 sm:overflow-visible sm:p-0 lg:grid-cols-3">
        {beyond.items.map((it, i) => (
          <li key={it.id} className="w-[82%] shrink-0 snap-center sm:w-auto">
            <LogCard item={it} index={i} fine={fine} variants={card(TILTS[i % TILTS.length])} />
          </li>
        ))}
      </ul>
    </section>
  );
}
