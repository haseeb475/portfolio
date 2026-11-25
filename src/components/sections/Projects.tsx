import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { moreProjects, projects } from "@/content/profile";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

const pad = (n: number) => String(n).padStart(2, "0");

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-h" className="page-x scroll-mt-20 py-20 md:py-36">
      <SectionHeader
        id="projects-h"
        index="03"
        label="Projects"
        title="Things I've built *on my own.*"
        intro="Open source, personal and hackathon work, plus my bachelor thesis. None of this was done for an employer."
      />

      {/* Table of contents */}
      <nav aria-label="Featured projects">
        <ol className="border-b border-rule">
          {projects.map((p, i) => (
            <li key={p.id} className="border-t border-rule">
              <a
                href={`#${p.id}`}
                className="group relative isolate grid min-h-16 grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden py-5 md:grid-cols-[4rem_1.2fr_1fr_9rem_2rem] md:py-6"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-left scale-x-0 bg-accent-soft transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                />
                <span className="font-mono text-xs text-muted">{pad(i + 1)}</span>
                <span className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-none tracking-[-0.01em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                  {p.title}
                </span>
                <span className="hidden text-ink-2 md:block">{p.kicker}</span>
                <span className="label-mono hidden text-muted md:block">{p.context}</span>
                <ArrowDownRight className="size-5 justify-self-end text-muted transition-all duration-500 group-hover:-rotate-45 group-hover:text-ink" />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8">
        {projects.map((p, i) => (
          <CaseStudy key={p.id} project={p} index={i} total={projects.length} />
        ))}
      </div>

      {/* More projects */}
      <div className="border-t border-rule pt-16">
        <h3 className="label-mono text-muted">More projects</h3>
        <ul className="mt-6">
          {moreProjects.map((p, i) => {
            const Row = p.href ? "a" : "div";
            return (
              <li key={p.title} className="border-b border-rule">
                <Reveal delay={Math.min(i, 4) * 0.05}>
                  <Row
                    {...(p.href ? { href: p.href, target: "_blank", rel: "noreferrer" } : {})}
                    className="group grid gap-x-8 gap-y-1.5 py-6 md:grid-cols-[7rem_1fr_1.4fr_13rem] md:items-baseline"
                  >
                    <span className="font-mono text-xs text-muted">{p.period}</span>
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-lg font-medium">{p.title}</span>
                      {p.href && <ArrowUpRight className="size-4 self-center text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                      {p.badge && <span className="label-mono text-accent">{p.badge}</span>}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-ink-2">{p.body}</span>
                    <span className="font-mono text-xs text-muted md:text-right">{p.stack}</span>
                  </Row>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
