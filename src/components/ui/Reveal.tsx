"use client";

import { m, type HTMLMotionProps } from "motion/react";
import { duration, ease, inView } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fade-and-rise on first scroll into view. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: duration.base, ease: ease.outExpo, delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
