/**
 * Topographic contour lines for the hero background: the "field map" the rest of the site
 * (road, stage map) lives on. Generated once at build time, deterministic, no JS on the client.
 */

type Peak = { cx: number; cy: number; rings: number; step: number; seed: number; squash: number };

const PEAKS: Peak[] = [
  { cx: 1180, cy: 260, rings: 9, step: 34, seed: 1.7, squash: 0.78 },
  { cx: 240, cy: 760, rings: 7, step: 38, seed: 4.2, squash: 0.7 },
  { cx: 760, cy: 980, rings: 6, step: 40, seed: 2.9, squash: 0.62 },
];

function ring(p: Peak, k: number) {
  const R = (k + 1) * p.step;
  let d = "";
  const n = 96;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wobble =
      1 +
      0.1 * Math.sin(3 * a + p.seed + k * 0.45) +
      0.06 * Math.sin(5 * a + p.seed * 1.9 + k * 0.8) +
      0.03 * Math.sin(9 * a + p.seed * 3.1);
    const x = p.cx + Math.cos(a) * R * wobble;
    const y = p.cy + Math.sin(a) * R * wobble * p.squash;
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + "Z";
}

const PATHS = PEAKS.flatMap((p, pi) => Array.from({ length: p.rings }, (_, k) => ({ d: ring(p, k), key: `${pi}-${k}`, major: k % 3 === 2 })));

export function Contours() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_85%_75%_at_60%_40%,black_30%,transparent_80%)]"
    >
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="contour-drift absolute -inset-[4%] h-[108%] w-[108%]">
        {PATHS.map((p) => (
          <path
            key={p.key}
            d={p.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={p.major ? 1.3 : 0.9}
            className={p.major ? "text-ink/[0.16]" : "text-ink/[0.1]"}
          />
        ))}
        {/* summit marks, like on a survey map */}
        {PEAKS.map((p) => (
          <g key={`m${p.cx}`} className="text-ink/[0.18]">
            <path d={`M${p.cx - 6} ${p.cy + 4} L${p.cx} ${p.cy - 6} L${p.cx + 6} ${p.cy + 4} Z`} fill="currentColor" />
          </g>
        ))}
      </svg>
    </div>
  );
}
