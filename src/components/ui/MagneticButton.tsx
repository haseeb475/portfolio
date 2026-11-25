"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { spring } from "@/lib/motion";
import { useFinePointer } from "@/lib/useFinePointer";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  download?: boolean;
  external?: boolean;
};

/** Link-button that leans toward the pointer (mouse/trackpad only). */
export function MagneticButton({ href, children, variant = "solid", className, download, external }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(0), spring.soft);
  const y = useSpring(useMotionValue(0), spring.soft);

  const onMove = (e: React.PointerEvent) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.a
      ref={ref}
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-6 text-[0.9375rem] font-medium transition-colors duration-300",
        variant === "solid"
          ? "bg-ink text-paper hover:bg-accent dark:hover:text-panel"
          : "border border-rule text-ink hover:border-ink",
        className,
      )}
    >
      {children}
    </m.a>
  );
}
