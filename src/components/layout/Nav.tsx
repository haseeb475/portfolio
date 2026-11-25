"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile, sections } from "@/content/profile";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";

const ids = sections.map((s) => s.id);
const pad = (n: number) => String(n + 1).padStart(2, "0");

export function Nav() {
  const active = useScrollSpy(ids);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4 ? true : y < prev - 4 ? false : hidden);
  });

  // Lock scroll + close on Escape while the mobile sheet is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <m.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
          scrolled ? "border-b border-rule bg-paper/92 backdrop-blur-md" : "border-b border-transparent",
        )}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: ease.outExpo }}
      >
        <div className="page-x flex h-16 items-center justify-between gap-6">
          <a href="#top" className="group flex min-h-11 items-center gap-3">
            <span aria-hidden className="grid size-8 place-items-center rounded-full bg-ink font-mono text-[0.6875rem] font-medium text-paper transition-colors group-hover:bg-accent">
              {profile.initials}
            </span>
            <span className="text-sm font-medium max-sm:sr-only">{profile.name}</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map((s, i) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative flex min-h-11 items-center gap-1.5 px-3 text-[0.8125rem] transition-colors",
                        isActive ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      <span className="font-mono text-[0.625rem] text-muted">{pad(i)}</span>
                      {s.label}
                      {isActive && (
                        <m.span
                          layoutId="nav-indicator"
                          className="absolute inset-x-3 bottom-2 h-px bg-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden min-h-10 items-center rounded-full bg-ink px-4 text-[0.8125rem] font-medium text-paper transition-colors hover:bg-accent sm:inline-flex lg:ml-2"
            >
              Let&apos;s talk
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-full text-ink lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* Reading progress */}
        <m.div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent" style={{ scaleX: progress }} />
      </m.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-panel text-panel-ink lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: ease.inOutQuart }}
          >
            <div className="page-x flex h-16 items-center justify-between">
              <span className="label-mono text-panel-muted">Index</span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-full"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="page-x flex flex-1 flex-col justify-center">
              <ul>
                {sections.map((s, i) => (
                  <li key={s.id} className="overflow-hidden border-t border-panel-rule last:border-b">
                    <m.a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-4"
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.7, ease: ease.outExpo, delay: 0.25 + i * 0.05 }}
                    >
                      <span className="font-mono text-xs text-signal">{pad(i)}</span>
                      <span className="font-display text-[2.5rem] leading-none">{s.label}</span>
                    </m.a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="page-x label-mono pb-8 text-panel-muted">
              <a href={`mailto:${profile.email}`} className="normal-case tracking-normal">
                {profile.email}
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
