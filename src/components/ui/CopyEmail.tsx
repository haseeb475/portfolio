"use client";

import { AnimatePresence, m } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ease } from "@/lib/motion";

/** Big mailto link + copy-to-clipboard with an animated confirmation. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={`mailto:${email}`}
        className="group relative font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-none break-all"
      >
        {email}
        <span
          aria-hidden
          className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
        />
      </a>
      <button
        type="button"
        onClick={copy}
        className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-panel-rule px-4 font-mono text-xs text-panel-ink transition-colors hover:border-signal hover:text-signal"
        aria-label={copied ? "Email address copied" : "Copy email address"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={copied ? "ok" : "copy"}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.25, ease: ease.outExpo }}
            className="inline-flex items-center gap-2"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </m.span>
        </AnimatePresence>
        <span className="sr-only" aria-live="polite">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </button>
    </div>
  );
}
