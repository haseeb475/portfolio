"use client";

import { AnimatePresence, m, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowDown, ArrowUpRight, Award, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { education, experience, journey, journeyOrder, type Education, type JourneyStage, type Role, type Turn } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { formatMonth, formatRange } from "@/lib/dates";
import { ease } from "@/lib/motion";
import { buildRoute, piecewise, type Pt, type Route } from "@/lib/route";
import { useFinePointer } from "@/lib/useFinePointer";
import { BeamGradient, CarShape } from "@/components/ui/RallyCar";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────
 *  "The road so far": work and study as one rally stage.
 *  Desktop: a sticky stage map where a car drives the route as you scroll,
 *           next to a Dakar-style roadbook.
 *  Mobile:  the road runs down the left edge and the car follows your scroll.
 *  All car movement is written straight to the DOM (no re-render per frame).
 * ───────────────────────────────────────────────────────────────────────── */

type Resolved = (
  | { stage: JourneyStage & { kind: "work" }; role: Role }
  | { stage: JourneyStage & { kind: "study" }; edu: Education }
) & { n: number /* chronological stage number, SS1 = first */ };

const CHRONO: Resolved[] = journey.map((s, i) =>
  s.kind === "work"
    ? { stage: s, role: experience.find((r) => r.id === s.id)!, n: i + 1 }
    : { stage: s, edu: education.find((e) => e.school === s.school)!, n: i + 1 },
);
const NEWEST_FIRST = journeyOrder === "newest-first";
/** Stages in display (and driving) order. */
const STAGES = NEWEST_FIRST ? [...CHRONO].reverse() : CHRONO;
const displayIndexOf = (n: number) => (NEWEST_FIRST ? CHRONO.length - n : n - 1);

/** What's happening today: open-ended jobs first, then studies. */
const NOW = [...CHRONO]
  .filter((r) => ("role" in r ? !r.role.end : !r.edu.end))
  .sort((a, b) => Number("edu" in a) - Number("edu" in b));

const nameOf = (r: Resolved) =>
  "role" in r ? r.role.company.replace(" GmbH", "") : r.edu.school.startsWith("FAST") ? "FAST" : "Uni Passau";
const placeOf = (r: Resolved) =>
  r.stage.kind === "work" && r.stage.remote ? `Remote for ${r.stage.remote.city}` : `${r.stage.city}, ${r.stage.country}`;
const startOf = (r: Resolved) => ("role" in r ? r.role.start : r.edu.start);
const yearOf = (ym: string) => {
  const [y, mo] = ym.split("-").map(Number);
  return y + (mo - 1) / 12;
};
const STAGE_YEARS = STAGES.map((s) => yearOf(startOf(s)));

/* ───────────── Desktop stage map geometry (viewBox 600 × 640) ─────────────
 *  Waypoints are listed oldest first; `stage` is the chronological index.
 */

const MAP_W = 600;
const MAP_H = 640;

const WAYPOINTS: (Pt & { stage?: number })[] = [
  { x: 522, y: 486, stage: 0 }, // Islamabad · FAST
  { x: 566, y: 444 },
  { x: 548, y: 392, stage: 1 }, // Islamabad · Alachisoft
  { x: 500, y: 368 },
  { x: 470, y: 312, stage: 2 }, // Cytomate (remote, Doha team)
  { x: 420, y: 342 },
  { x: 360, y: 392 },
  { x: 300, y: 380 },
  { x: 276, y: 318 },
  { x: 300, y: 256 },
  { x: 252, y: 206 },
  { x: 196, y: 176 },
  { x: 156, y: 150, stage: 3 }, // Passau · university
  { x: 110, y: 172 },
  { x: 104, y: 232, stage: 4 }, // Passau · detoxi (remote, Berlin team)
];

const DRIVE_PTS = NEWEST_FIRST ? [...WAYPOINTS].reverse() : WAYPOINTS;
const MAP_ROUTE = buildRoute(DRIVE_PTS);
const LEN_BY_CHRONO: number[] = [];
DRIVE_PTS.forEach((w, i) => {
  if (w.stage !== undefined) LEN_BY_CHRONO[w.stage] = MAP_ROUTE.marks[i];
});
/** Road length at each stage, in display order. */
const MAP_STAGE_LENS = STAGES.map((s) => LEN_BY_CHRONO[s.n - 1]);
/** Stage marker positions, chronological. */
const MAP_STAGE_PTS = WAYPOINTS.filter((w) => w.stage !== undefined);

/** Where remote teams actually sit, linked to the stage with a dashed line. */
const REMOTE_LINKS = [
  { to: { x: 330, y: 552 }, d: "M470 312 C 480 430, 430 520, 338 548", label: { x: 452, y: 470 } }, // Cytomate → Doha
  { to: { x: 232, y: 50 }, d: "M104 232 C 40 160, 120 60, 225 51", label: { x: 52, y: 128 } }, // detoxi → Berlin
];

const STAGE_LABELS: { dx: number; dy: number; anchor: "start" | "middle" | "end" }[] = [
  { dx: 16, dy: 26, anchor: "start" },
  { dx: -14, dy: 20, anchor: "end" },
  { dx: 14, dy: -14, anchor: "start" },
  { dx: 16, dy: -14, anchor: "start" },
  { dx: 0, dy: 28, anchor: "middle" },
];

const CITY_LABELS = [
  { name: "Islamabad", x: 590, y: 540, anchor: "end" as const },
  { name: "Doha", x: 330, y: 588, anchor: "middle" as const },
  { name: "Berlin", x: 232, y: 34, anchor: "middle" as const },
  { name: "Passau", x: 104, y: 288, anchor: "middle" as const },
];

const COUNTRIES = [
  { name: "PAKISTAN", x: 520, y: 250 },
  { name: "QATAR", x: 330, y: 620 },
  { name: "GERMANY", x: 400, y: 90 },
];

/** Deterministic wobbly contour rings, like a topographic map. */
function contours(cx: number, cy: number, radii: number[], seed: number) {
  return radii.map((R, k) => {
    let d = "";
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const rr = R * (1 + 0.09 * Math.sin(3 * a + seed + k * 0.6) + 0.05 * Math.sin(5 * a + seed * 2.1 + k));
      d += `${i ? "L" : "M"}${(cx + Math.cos(a) * rr * 1.15).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    }
    return d + "Z";
  });
}

const CONTOURS = [
  ...contours(430, 230, [40, 75, 110, 145, 180], 1.3),
  ...contours(120, 470, [30, 65, 100, 135], 4.1),
  ...contours(560, 620, [40, 80, 120], 2.2),
];

/* ───────────── Car ───────────── */

const carTransform = (x: number, y: number, angle: number, scale: number) =>
  `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(${scale})`;

/* ───────────── Tulip (roadbook arrow) ───────────── */

const TULIPS: Record<Turn, { path: string; head: string; extra?: string }> = {
  start: { path: "M32 56 V12", head: "M26 18 L32 10 L38 18", extra: "M22 56 H42" },
  right: { path: "M32 56 V36 Q32 24 46 24 H52", head: "M47 18 L54 24 L47 30", extra: "M32 24 V8" },
  left: { path: "M32 56 V36 Q32 24 18 24 H12", head: "M17 18 L10 24 L17 30", extra: "M32 30 H56" },
  hairpin: { path: "M28 56 V26 Q28 12 40 12 Q50 12 50 24 V44", head: "M44 39 L50 47 L56 39", extra: "M10 34 H22" },
  now: { path: "M32 56 V14", head: "M26 20 L32 12 L38 20", extra: "M42 30 V8 M42 8 H56 L52 13 L56 18 H42" },
};

function Tulip({ turn, active }: { turn: Turn; active: boolean }) {
  const t = TULIPS[turn];
  const stroke = active ? "var(--accent)" : "var(--ink)";
  return (
    <svg viewBox="0 0 64 64" className="size-full" aria-hidden>
      {t.extra &&
        (turn === "now" ? (
          <path d={t.extra} stroke={stroke} strokeWidth={2} fill="none" strokeLinejoin="round" />
        ) : (
          <path d={t.extra} stroke="var(--muted)" strokeWidth={1.5} fill="none" strokeDasharray="3 3" />
        ))}
      <circle cx={turn === "hairpin" ? 28 : 32} cy={56} r={3.5} fill={stroke} />
      <m.path
        key={active ? "on" : "off"}
        d={t.path}
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: active ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: ease.outExpo }}
      />
      <path d={t.head} fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────────── Roadbook row ───────────── */

function Row({
  r,
  index,
  active,
  passed,
  rowRef,
}: {
  r: Resolved;
  index: number;
  active: boolean;
  passed: boolean;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const isWork = "role" in r;
  const start = startOf(r);
  const end = isWork ? r.role.end : r.edu.end;

  return (
    <li
      ref={rowRef}
      className={cn(
        "relative grid grid-cols-[4.5rem_1fr] gap-x-4 border-t py-9 transition-colors duration-500 lg:grid-cols-[3.5rem_5rem_1fr] lg:gap-x-5 lg:py-12",
        active ? "border-accent" : "border-rule",
      )}
    >
      {/* SS + year (desktop column) */}
      <div className="hidden lg:block">
        <p className={cn("font-mono text-sm transition-colors", active || passed ? "text-accent" : "text-muted")}>SS{r.n}</p>
        <p className="mt-1 font-mono text-xs text-muted">{start.slice(0, 4)}</p>
      </div>

      {/* Tulip */}
      <div>
        <p className={cn("mb-2 font-mono text-xs lg:hidden", active || passed ? "text-accent" : "text-muted")}>
          SS{r.n}
          <span className="ml-1.5 text-muted">{start.slice(0, 4)}</span>
        </p>
        <div
          className={cn(
            "aspect-square w-full rounded-md border bg-paper p-1.5 transition-colors duration-500",
            active ? "border-accent" : "border-rule",
          )}
        >
          <Tulip turn={r.stage.turn} active={active} />
        </div>
      </div>

      {/* Notes */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em]",
              isWork ? "bg-ink text-paper" : "border border-ink-2 text-ink-2",
            )}
          >
            {isWork ? "Work" : "Study"}
          </span>
          <span className="label-mono text-muted">{formatRange(start, end)}</span>
          {!end && isWork && (
            <>
              <span className="pulse-dot size-2 rounded-full bg-accent" aria-hidden />
              <span className="sr-only">(current)</span>
            </>
          )}
        </div>

        <p className="mt-3 font-mono text-xs italic text-muted">“{r.stage.note}”</p>

        {isWork ? (
          <>
            <h3 className="mt-3 font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.05]">{r.role.company}</h3>
            <p className="mt-1.5 text-ink-2">
              {r.role.role} <span className="text-muted">· {r.role.location}</span>
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">{r.role.summary}</p>
            {r.role.stats && (
              <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-8">
                {r.role.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-[1.5rem] leading-none sm:text-[1.75rem]">{s.value}</dd>
                    <dd className="mt-1 max-w-[8rem] text-[0.8125rem] leading-snug text-muted" aria-hidden>
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
              {r.role.stack.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            {r.role.links?.some((l) => l.href) && (
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                {r.role.links
                  .filter((l) => l.href)
                  .map((l) => (
                    <a
                      key={l.label}
                      href={l.href!}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline decoration-rule underline-offset-[6px] transition-colors hover:decoration-ink"
                    >
                      {l.label}
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ))}
              </p>
            )}
            {r.role.badge && (
              <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-rule px-3 py-2 text-sm text-ink-2">
                <Award className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {r.role.badge}
              </p>
            )}
            <div>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={`stage-${index}-details`}
                className="mt-3 inline-flex min-h-11 items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-ink"
              >
                {open ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                {open ? "Hide details" : "What I did"}
              </button>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  id={`stage-${index}-details`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: ease.outExpo }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2.5 pb-1 pt-1">
                    {r.role.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
                        <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </m.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1]">{r.edu.degree}</h3>
            <p className="mt-1.5 text-ink-2">
              {r.edu.school} <span className="text-muted">· {r.edu.location}</span>
            </p>
            {r.edu.notes && (
              <ul className="mt-4 space-y-2">
                {r.edu.notes.map((n) => (
                  <li key={n} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-muted" />
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </li>
  );
}

/* ───────────── Section ───────────── */

export function Journey() {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const geo = useRef({ centers: [] as number[], height: 1 });
  const [mobile, setMobile] = useState<{ route: Route; height: number; centers: number[] } | null>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const inView = useInView(section, { margin: "-30% 0px -30% 0px" });

  // DOM handles for per-frame updates
  const mapCar = useRef<SVGGElement>(null);
  const mapTrail = useRef<SVGPathElement>(null);
  const mapDust = useRef<SVGGElement>(null);
  const mobCar = useRef<SVGGElement>(null);
  const mobTrail = useRef<SVGPathElement>(null);
  const yearText = useRef<HTMLSpanElement>(null);
  const yearTextMob = useRef<HTMLSpanElement>(null);
  const last = useRef({ len: 0, speed: 0 });
  const mobileRef = useRef(mobile);
  useEffect(() => {
    mobileRef.current = mobile;
  }, [mobile]);

  const { scrollYProgress } = useScroll({ target: list, offset: ["start center", "end center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.5 });

  const draw = useCallback((p: number) => {
    const { centers, height } = geo.current;
    if (!centers.length) return;
    const y = p * height;

    // Desktop map
    const len = piecewise(y, centers, MAP_STAGE_LENS);
    const pos = MAP_ROUTE.at(len);
    mapCar.current?.setAttribute("transform", carTransform(pos.x, pos.y, pos.angle, 1.1));
    mapTrail.current?.setAttribute("stroke-dashoffset", String(MAP_ROUTE.total - len));

    // Dust trail, stronger when moving fast
    const speed = Math.min(1, Math.abs(len - last.current.len) / 6);
    last.current.speed = last.current.speed * 0.6 + speed * 0.4;
    last.current.len = len;
    if (mapDust.current) {
      const puffs = mapDust.current.children;
      for (let i = 0; i < puffs.length; i++) {
        const b = MAP_ROUTE.at(len - 16 - i * 9);
        const c = puffs[i] as SVGCircleElement;
        c.setAttribute("cx", (b.x + Math.sin(len / 7 + i) * 2).toFixed(1));
        c.setAttribute("cy", (b.y + Math.cos(len / 9 + i) * 2).toFixed(1));
        c.setAttribute("opacity", (last.current.speed * (0.5 - i * 0.12)).toFixed(2));
      }
    }

    // Mobile strip
    const mob = mobileRef.current;
    if (mob) {
      const ml = mob.route.lenAtY(y);
      const mp = mob.route.at(ml);
      mobCar.current?.setAttribute("transform", carTransform(mp.x, mp.y, mp.angle, 0.72));
      mobTrail.current?.setAttribute("stroke-dashoffset", String(mob.route.total - ml));
    }

    // Telemetry
    const year = String(Math.floor(piecewise(y, centers, STAGE_YEARS)));
    if (yearText.current) yearText.current.textContent = year;
    if (yearTextMob.current) yearTextMob.current.textContent = year;

    let idx = 0;
    for (let i = 0; i < centers.length; i++) if (y >= centers[i] - 40) idx = i;
    setActive((a) => (a === idx ? a : idx));
  }, []);

  useMotionValueEvent(reduced ? scrollYProgress : smooth, "change", draw);

  // Measure row centres; rebuild the mobile road whenever layout changes.
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const measure = () => {
      const height = el.offsetHeight || 1;
      const centers = rows.current.map((r) => (r ? r.offsetTop + Math.min(r.offsetHeight / 2, 120) : 0));
      geo.current = { centers, height };

      // Gentle S-bends between stages; stage points sit near the middle of the strip.
      const pts: Pt[] = [{ x: 24, y: 0 }];
      centers.forEach((c, i) => {
        if (i > 0) {
          const prev = centers[i - 1];
          const gap = c - prev;
          const bends = Math.max(1, Math.round(gap / 220));
          for (let b = 1; b <= bends; b++) {
            pts.push({ x: (b + i) % 2 ? 10 : 38, y: prev + (gap * b) / (bends + 1) });
          }
        }
        pts.push({ x: 24, y: c });
      });
      pts.push({ x: 24, y: height });
      setMobile({ route: buildRoute(pts, 20), height, centers });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    draw((reduced ? scrollYProgress : smooth).get());
  }, [mobile, draw, reduced, scrollYProgress, smooth]);

  const goTo = useCallback(
    (i: number) => {
      const row = rows.current[i];
      if (!row) return;
      const r = row.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + r.top + Math.min(r.height / 2, 120) - window.innerHeight / 2,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  // Easter egg: ← → drive between stages (desktop, while the section is on screen)
  useEffect(() => {
    if (!fine || !inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      const next = Math.max(0, Math.min(STAGES.length - 1, active + (e.key === "ArrowRight" ? 1 : -1)));
      if (!rows.current[next]) return;
      e.preventDefault();
      goTo(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fine, inView, active, goTo]);

  const first = MAP_ROUTE.at(MAP_STAGE_LENS[0]);
  const current = STAGES[active];
  const currentName = nameOf(current);

  const progressDots = useMemo(() => STAGES.map((_, i) => i), []);

  return (
    <section ref={section} id="experience" aria-labelledby="experience-h" className="page-x scroll-mt-20 py-20 md:py-36">
      <SectionHeader
        id="experience-h"
        index="02"
        label="Experience and education"
        title="The road *so far.*"
        intro={
          NEWEST_FIRST
            ? "Every job and every degree, most recent first. Scroll down and the car drives you back to where it all started."
            : "Every job and every degree, in the order they happened. Scroll down and the car will drive you through it."
        }
      />

      {/* Right now: the answer recruiters look for first */}
      <div className="mb-10 grid gap-5 rounded-xl border border-rule bg-paper-2 p-5 md:mb-14 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div>
          <p className="label-mono flex items-center gap-2.5 text-accent">
            <span className="pulse-dot size-2 rounded-full bg-accent" aria-hidden />
            Right now
          </p>
          <ul className="mt-3 space-y-1.5">
            {NOW.map((r) => (
              <li key={r.n} className="flex flex-wrap items-baseline gap-x-2 text-[1.0625rem]">
                <span className="font-medium">{"role" in r ? r.role.role : r.edu.degree}</span>
                <span className="text-ink-2">at {"role" in r ? r.role.company : r.edu.school}</span>
                <span className="font-mono text-xs text-muted">since {formatMonth(startOf(r))}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={() => goTo(STAGES.length - 1)}
          className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-ink px-5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
        >
          Skip to today
          <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
        </button>
      </div>

      {/* Mobile telemetry bar */}
      <div className="sticky top-0 z-30 -mx-5 mb-2 border-y border-rule bg-paper/95 px-5 py-3 backdrop-blur-sm md:-mx-8 md:px-8 lg:hidden" aria-hidden>
        <div className="flex items-center justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.08em]">
          <span className="truncate">
            <span className="text-accent">SS{current.n}</span> <span className="text-ink">{currentName}</span>
            <span className="text-muted"> · {current.stage.city}</span>
          </span>
          <span className="shrink-0 text-muted">
            Year <span ref={yearTextMob} className="text-ink tabular-nums">{Math.floor(STAGE_YEARS[0])}</span>
          </span>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1">
          {progressDots.map((i) => (
            <span key={i} className={cn("h-1 rounded-full transition-colors duration-500", i <= active ? "bg-accent" : "bg-rule")} />
          ))}
        </div>
      </div>

      <div className="grid gap-x-12 lg:grid-cols-12">
        {/* Desktop stage map */}
        <div className="hidden lg:col-span-6 lg:block">
          <figure className="sticky top-24 overflow-hidden rounded-[14px] bg-paper-2 ring-1 ring-rule">
            <div className="flex items-center justify-between border-b border-rule px-4 py-2.5 font-mono text-[0.6875rem] text-muted">
              <span>stage map · islamabad → passau</span>
              <span className="hidden xl:inline">{fine ? "tip: ← → to drive" : ""}</span>
            </div>
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="block h-[calc(100svh-15rem)] max-h-[600px] min-h-[420px] w-full"
              role="img"
              aria-label="Map of my route from Islamabad, Pakistan, to Passau, Germany, with remote jobs for teams in Doha, Qatar and Berlin."
            >
              <defs>
                <BeamGradient id="beam-map" />
              </defs>

              {/* graticule */}
              {[100, 200, 300, 400, 500].map((x) => (
                <line key={`v${x}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke="var(--rule)" strokeWidth={0.6} strokeDasharray="2 6" />
              ))}
              {[100, 200, 300, 400, 500, 600].map((y) => (
                <line key={`h${y}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke="var(--rule)" strokeWidth={0.6} strokeDasharray="2 6" />
              ))}

              {/* terrain */}
              {CONTOURS.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="var(--rule)" strokeWidth={1} opacity={0.9} />
              ))}

              {COUNTRIES.map((c) => (
                <text key={c.name} x={c.x} y={c.y} textAnchor="middle" className="fill-muted font-mono text-[11px] tracking-[0.5em]" opacity={0.55}>
                  {c.name}
                </text>
              ))}

              {/* road */}
              <path d={MAP_ROUTE.d} fill="none" stroke="var(--rule)" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
              <path d={MAP_ROUTE.d} fill="none" stroke="var(--paper)" strokeWidth={1.2} strokeDasharray="5 7" strokeLinecap="round" />
              <path
                ref={mapTrail}
                d={MAP_ROUTE.d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={MAP_ROUTE.total}
                strokeDashoffset={MAP_ROUTE.total - MAP_STAGE_LENS[0]}
              />

              {/* cities */}
              {CITY_LABELS.map((c) => (
                <text key={c.name} x={c.x} y={c.y} textAnchor={c.anchor} className="fill-ink-2 font-display text-[17px] italic">
                  {c.name}
                </text>
              ))}

              {/* stages */}
              {/* remote team links */}
              {REMOTE_LINKS.map((l, i) => (
                <g key={i}>
                  <path d={l.d} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="2 5" strokeLinecap="round" />
                  <circle cx={l.to.x} cy={l.to.y} r={5} fill="var(--paper)" stroke="var(--muted)" strokeWidth={1.5} />
                  <text x={l.label.x} y={l.label.y} className="fill-muted font-mono text-[10px] tracking-[0.12em]">
                    remote
                  </text>
                </g>
              ))}

              {MAP_STAGE_PTS.map((p, i) => {
                const s = CHRONO[i];
                const done = displayIndexOf(s.n) <= active;
                const lbl = STAGE_LABELS[i];
                const name = nameOf(s);
                return (
                  <g key={i}>
                    {s.stage.kind === "work" ? (
                      <rect
                        x={p.x - 7}
                        y={p.y - 7}
                        width={14}
                        height={14}
                        rx={3}
                        fill={done ? "var(--accent)" : "var(--paper)"}
                        stroke={done ? "var(--accent)" : "var(--ink)"}
                        strokeWidth={1.5}
                        className="transition-colors duration-500"
                      />
                    ) : (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={7.5}
                        fill="var(--paper)"
                        stroke={done ? "var(--accent)" : "var(--ink)"}
                        strokeWidth={2}
                        className="transition-colors duration-500"
                      />
                    )}
                    <text x={p.x + lbl.dx} y={p.y + lbl.dy} textAnchor={lbl.anchor} className="font-mono text-[11px]">
                      <tspan className={done ? "fill-accent" : "fill-muted"}>SS{s.n} </tspan>
                      <tspan className="fill-ink">{name}</tspan>
                    </text>
                  </g>
                );
              })}

              {/* dust + car */}
              <g ref={mapDust} aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <circle key={i} r={4 + i * 2.2} fill="var(--muted)" opacity={0} />
                ))}
              </g>
              <g ref={mapCar} transform={carTransform(first.x, first.y, first.angle, 1.1)}>
                <CarShape beamId="beam-map" />
              </g>
            </svg>

            {/* Telemetry */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 border-t border-rule px-4 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.08em]">
              <span className="text-muted">
                Year <span ref={yearText} className="ml-1 text-sm text-ink tabular-nums">{Math.floor(STAGE_YEARS[0])}</span>
              </span>
              <span className="truncate text-muted">
                Stage <span className="ml-1 text-accent">SS{current.n}</span> <span className="text-ink">{currentName}</span> · {placeOf(current)}
              </span>
              <span className="flex gap-1" aria-hidden>
                {progressDots.map((i) => (
                  <span key={i} className={cn("h-1.5 w-4 rounded-full transition-colors duration-500", i <= active ? "bg-accent" : "bg-rule")} />
                ))}
              </span>
            </div>
            <figcaption className="sr-only">Stage map showing where each job and degree happened.</figcaption>
          </figure>
        </div>

        {/* Roadbook */}
        <div className="min-w-0 lg:col-span-6">
          <div className="hidden grid-cols-[3.5rem_5rem_1fr] gap-x-5 pb-3 lg:grid" aria-hidden>
            <span className="label-mono text-muted">Stage</span>
            <span className="label-mono text-muted">Direction</span>
            <span className="label-mono text-muted">Notes</span>
          </div>

          <div className="relative">
            {/* Mobile road strip */}
            {mobile && (
              <svg
                className="pointer-events-none absolute left-0 top-0 lg:hidden"
                width={48}
                height={mobile.height}
                viewBox={`0 0 48 ${mobile.height}`}
                aria-hidden
              >
                <defs>
                  <BeamGradient id="beam-mob" />
                </defs>
                <path d={mobile.route.d} fill="none" stroke="var(--rule)" strokeWidth={9} strokeLinecap="round" />
                <path d={mobile.route.d} fill="none" stroke="var(--paper)" strokeWidth={1} strokeDasharray="4 6" />
                <path
                  ref={mobTrail}
                  d={mobile.route.d}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray={mobile.route.total}
                  strokeDashoffset={mobile.route.total}
                />
                {mobile.centers.map((c, i) => {
                  const p = mobile.route.at(mobile.route.lenAtY(c));
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={5}
                      fill={i <= active ? "var(--accent)" : "var(--paper)"}
                      stroke={i <= active ? "var(--accent)" : "var(--ink)"}
                      strokeWidth={1.5}
                    />
                  );
                })}
                <g ref={mobCar}>
                  <CarShape beamId="beam-mob" />
                </g>
              </svg>
            )}

            <ol ref={list} className="relative pl-14 lg:pl-0" aria-label={`Experience and education, ${NEWEST_FIRST ? "most recent" : "oldest"} first`}>
              {STAGES.map((s, i) => (
                <Row
                  key={i}
                  r={s}
                  index={i}
                  active={i === active}
                  passed={i < active}
                  rowRef={(el) => {
                    rows.current[i] = el;
                  }}
                />
              ))}
            </ol>
          </div>

          <a
            href="#projects"
            className="mt-4 inline-flex min-h-11 items-center gap-2 border-t border-rule pt-4 font-mono text-xs text-ink-2 transition-colors hover:text-ink"
          >
            My own projects are in the next section →
          </a>
        </div>
      </div>
    </section>
  );
}
