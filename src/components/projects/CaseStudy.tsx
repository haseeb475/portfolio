import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy as CaseStudyT } from "@/content/profile";
import { Panel } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Diagram } from "./diagrams/Diagram";
import { diagrams, diagramTitles } from "./diagrams/specs";
import { MetricCounter } from "./MetricCounter";
import { MobileExpand } from "@/components/ui/MobileExpand";

type Props = { project: CaseStudyT; index: number; total: number };

const pad = (n: number) => String(n).padStart(2, "0");

type ShotT = NonNullable<CaseStudyT["gallery"]>[number];

function Shot({ shot, sizes }: { shot: ShotT; sizes: string }) {
  return (
    <figure>
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        className="h-auto w-full rounded-[12px] bg-paper-2 shadow-[0_24px_48px_-28px_rgb(0_0_0/0.35)] ring-1 ring-rule"
      />
      {shot.caption && <figcaption className="mt-3 text-[0.8125rem] leading-snug text-muted">{shot.caption}</figcaption>}
    </figure>
  );
}

export function CaseStudy({ project: p, index, total }: Props) {
  return (
    <article
      id={p.id}
      aria-labelledby={`${p.id}-title`}
      className="grid scroll-mt-24 gap-x-12 gap-y-8 border-t border-rule py-14 md:py-24 lg:grid-cols-12 lg:gap-y-10"
    >
      {/* Rail: sticky on desktop, a header on mobile */}
      <aside className="min-w-0 self-start lg:sticky lg:top-28 lg:col-span-4">
        <div className="label-mono flex flex-wrap items-center gap-3 text-muted">
          <span className="text-accent">
            {pad(index + 1)}/{pad(total)}
          </span>
          <span className="h-px w-6 bg-rule" aria-hidden />
          <span>{p.context}</span>
          <span aria-hidden>·</span>
          <span>{p.period}</span>
        </div>
        <h3 id={`${p.id}-title`} className="mt-6 font-display text-[clamp(2.5rem,4.6vw,3.9rem)] leading-[1] tracking-[-0.01em]">
          {p.title}
        </h3>
        <p className="mt-3 text-[1.0625rem] text-ink-2">{p.kicker}</p>

        <div className="mt-7 flex flex-wrap gap-1.5 border-t border-rule pt-6" aria-label="Stack">
          {p.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
          {p.links.map((l) =>
            l.href ? (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline decoration-rule underline-offset-[6px] transition-colors hover:decoration-ink"
                >
                  {l.label}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ) : (
              <li key={l.label} className="todo inline-flex min-h-11 items-center text-sm" title="Add this link in src/content/profile.ts">
                {l.label} (TODO)
              </li>
            ),
          )}
        </ul>
      </aside>

      {/* Story */}
      <div className="min-w-0 space-y-10 lg:col-span-8 lg:space-y-14">
        <Reveal>
          <p className="font-display text-[clamp(1.5rem,2.3vw,2rem)] leading-[1.28]">{p.summary}</p>
        </Reveal>

        {p.metrics.length > 0 && (
          <Reveal>
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-y border-rule py-7 md:grid-cols-4">
              {p.metrics.map((m) => (
                <MetricCounter key={m.label} metric={m} />
              ))}
            </div>
          </Reveal>
        )}

        <MobileExpand label="Read the full case study" className="space-y-14">
        {p.gallery && p.gallery.length > 0 && (
          <div className="space-y-8">
            <Reveal>
              <Shot shot={p.gallery[0]} sizes="(min-width: 1024px) 760px, 100vw" />
            </Reveal>
            {p.gallery.length > 1 && (
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
                {p.gallery.slice(1).map((g, i) => (
                  <Reveal key={g.src} delay={i * 0.08}>
                    <Shot shot={g} sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw" />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {p.diagram && (
          <Reveal>
            <Panel title={`${p.id} / architecture`} status="fig. 1" caption={p.diagramCaption}>
              <Diagram spec={diagrams[p.diagram]} title={diagramTitles[p.diagram]} className="p-2 md:p-4" />
            </Panel>
          </Reveal>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <h4 className="label-mono text-muted">Problem</h4>
            <p className="mt-3 leading-relaxed text-ink-2">{p.problem}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h4 className="label-mono text-muted">Approach</h4>
            <p className="mt-3 leading-relaxed text-ink-2">{p.approach}</p>
          </Reveal>
        </div>

        <section aria-label="Key engineering decisions">
          <h4 className="label-mono text-muted">Key decisions</h4>
          <ol className="mt-5 grid gap-x-8 md:grid-cols-3">
            {p.decisions.map((d, i) => (
              <li key={d.title} className="list-none border-t border-rule">
                <Reveal delay={i * 0.06} className="py-5">
                  <span className="font-mono text-xs text-accent" aria-hidden>
                    {pad(i + 1)}
                  </span>
                  <p className="mt-2 font-medium leading-snug">{d.title}</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{d.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
        </MobileExpand>
      </div>
    </article>
  );
}
