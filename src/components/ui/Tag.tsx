import { cn } from "@/lib/cn";

export function Tag({ children, tone = "paper", className }: { children: React.ReactNode; tone?: "paper" | "panel"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-wide",
        tone === "paper" ? "border-rule text-ink-2" : "border-panel-rule text-panel-ink/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
