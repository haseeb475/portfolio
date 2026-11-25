import { SplitWords } from "./SplitWords";
import { cn } from "@/lib/cn";

type Props = {
  index: string;
  label: string;
  title: string;
  intro?: string;
  className?: string;
  tone?: "paper" | "panel";
  /** id for the title — reference it from the section's aria-labelledby. */
  id?: string;
};

/** Journal-style section opener: § mark + hairline + serif title. */
export function SectionHeader({ index, label, title, intro, className, tone = "paper", id }: Props) {
  const muted = tone === "panel" ? "text-panel-muted" : "text-muted";
  const rule = tone === "panel" ? "bg-panel-rule" : "bg-rule";
  return (
    <header className={cn("mb-14 md:mb-20", className)}>
      <div className={cn("label-mono flex items-center gap-4", muted)}>
        <span>§{index}</span>
        <span className={cn("h-px flex-1", rule)} aria-hidden />
        <span>{label}</span>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
        <SplitWords
          id={id}
          text={title}
          className="font-display text-[clamp(2.3rem,4.8vw,4.4rem)] leading-[1.04] tracking-[-0.01em] md:col-span-8"
        />
        {intro && (
          <p className={cn("max-w-md text-[0.975rem] leading-relaxed md:col-span-4 md:justify-self-end", muted)}>
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
