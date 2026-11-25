/**
 * Smooth road geometry without touching the DOM.
 * Builds a Catmull-Rom spline through waypoints (as SVG cubic Béziers), samples it,
 * and answers "where am I and which way am I facing after L units of road?".
 */

export type Pt = { x: number; y: number };

export type Route = {
  d: string;
  total: number;
  /** Road length at each waypoint. */
  marks: number[];
  at(len: number): { x: number; y: number; angle: number };
  /** For roads that only ever move down the page: road length at a given y. */
  lenAtY(y: number): number;
};

const r = (n: number) => Math.round(n * 10) / 10;

export function buildRoute(pts: Pt[], steps = 28): Route {
  const n = pts.length;
  const P = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${r(pts[0].x)} ${r(pts[0].y)}`;
  const xs = [pts[0].x];
  const ys = [pts[0].y];
  const ls = [0];
  const marks = [0];

  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${r(c1.x)} ${r(c1.y)} ${r(c2.x)} ${r(c2.y)} ${r(p2.x)} ${r(p2.y)}`;

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const u = 1 - t;
      const x = u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x;
      const y = u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y;
      const k = xs.length - 1;
      ls.push(ls[k] + Math.hypot(x - xs[k], y - ys[k]));
      xs.push(x);
      ys.push(y);
    }
    marks.push(ls[ls.length - 1]);
  }

  const total = ls[ls.length - 1];
  const last = xs.length - 1;

  function at(len: number) {
    const L = Math.max(0, Math.min(total, len));
    let lo = 1;
    let hi = last;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ls[mid] < L) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo);
    const seg = ls[i] - ls[i - 1] || 1;
    const t = (L - ls[i - 1]) / seg;
    return {
      x: xs[i - 1] + (xs[i] - xs[i - 1]) * t,
      y: ys[i - 1] + (ys[i] - ys[i - 1]) * t,
      angle: (Math.atan2(ys[i] - ys[i - 1], xs[i] - xs[i - 1]) * 180) / Math.PI,
    };
  }

  function lenAtY(y: number) {
    if (y <= ys[0]) return 0;
    if (y >= ys[last]) return total;
    let lo = 1;
    let hi = last;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ys[mid] < y) lo = mid + 1;
      else hi = mid;
    }
    const i = lo;
    const span = ys[i] - ys[i - 1] || 1;
    return ls[i - 1] + (ls[i] - ls[i - 1]) * ((y - ys[i - 1]) / span);
  }

  return { d, total, marks, at, lenAtY };
}

/** Piecewise-linear map: x in `xsIn` → value in `out` (clamped at both ends). */
export function piecewise(x: number, xsIn: number[], out: number[]) {
  if (!xsIn.length) return out[0] ?? 0;
  if (x <= xsIn[0]) return out[0];
  for (let i = 1; i < xsIn.length; i++) {
    if (x <= xsIn[i]) {
      const t = (x - xsIn[i - 1]) / (xsIn[i] - xsIn[i - 1] || 1);
      return out[i - 1] + (out[i] - out[i - 1]) * t;
    }
  }
  return out[out.length - 1];
}
