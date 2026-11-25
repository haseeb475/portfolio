"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * On phones, keeps long detail behind a "Read more" button so pages stay short.
 * From the `lg` breakpoint up, the content is always shown and the button is hidden.
 */
export function MobileExpand({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} className={cn(open ? "block" : "hidden", "lg:block", className)}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rule text-sm font-medium transition-colors active:bg-paper-2 lg:hidden"
      >
        {open ? "Show less" : label}
        <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
      </button>
    </>
  );
}
