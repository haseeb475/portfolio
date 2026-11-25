import { cn } from "@/lib/cn";

type Props = {
  title: string;
  status?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  caption?: string;
};

/**
 * Dark "instrument panel" set into the paper page — the site's signature surface
 * for live visuals and architecture diagrams.
 */
export function Panel({ title, status, children, className, bodyClassName, caption }: Props) {
  return (
    <figure className={cn("relative", className)}>
      <div className="overflow-hidden rounded-[14px] bg-panel text-panel-ink shadow-[0_1px_0_rgb(255_255_255/0.06)_inset,0_30px_60px_-30px_rgb(0_0_0/0.45)] ring-1 ring-black/10 dark:ring-white/5">
        <div className="flex items-center justify-between gap-4 border-b border-panel-rule px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2 rounded-full bg-panel-rule" />
              <span className="size-2 rounded-full bg-panel-rule" />
              <span className="size-2 rounded-full bg-panel-rule" />
            </span>
            <span className="font-mono text-[0.6875rem] tracking-wide text-panel-muted">{title}</span>
          </div>
          {status && <div className="font-mono text-[0.6875rem] text-panel-muted">{status}</div>}
        </div>
        <div className={cn("bg-grid-panel", bodyClassName)}>{children}</div>
      </div>
      {caption && (
        <figcaption className="label-mono mt-3 flex gap-3 text-muted normal-case tracking-normal">
          <span className="uppercase tracking-[0.08em]">Fig.</span>
          <span className="font-sans text-[0.8125rem] leading-snug">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
