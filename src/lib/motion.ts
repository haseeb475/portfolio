import type { Transition, Variants } from "motion/react";

/** Motion tokens — every animation on the site draws from these. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
};

export const duration = { fast: 0.45, base: 0.7, slow: 1.1 } as const;

export const stagger = { chars: 0.04, words: 0.06, items: 0.08 } as const;

export const spring = {
  ui: { type: "spring", stiffness: 300, damping: 30 } satisfies Transition,
  soft: { type: "spring", stiffness: 160, damping: 18, mass: 0.6 } satisfies Transition,
};

/** Default viewport for scroll-triggered reveals. */
export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.outExpo } },
};

export const container = (gap: number = stagger.items, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
