import { ArrowDown, ArrowRight, FileText } from "lucide-react";
import { hero, profile } from "@/content/profile";
import { AgentTrace, TraceStatus } from "@/components/hero/AgentTrace";
import { Contours } from "@/components/hero/Contours";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Panel } from "@/components/ui/Panel";
import { LocalTime } from "@/components/ui/LocalTime";
import { splitWords } from "@/components/ui/RichText";
import { publicFileExists } from "@/lib/assets";
import { cn } from "@/lib/cn";

export function Hero() {
  const words = splitWords(hero.headline);
  const hasResume = publicFileExists(profile.links.resume);
  const afterHeadline = words.length * 55 + 350;

  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden pt-28 md:pt-36">
      {/* Topographic contour lines: the field map the rest of the site is drawn on */}
      <Contours />

      <div className="page-x grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <div className="anim-fade-up flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "0ms" }}>
            {hero.availability.open && (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-paper px-3 py-1.5 text-[0.8125rem]">
                <span className="pulse-dot size-2 rounded-full bg-accent" aria-hidden />
                <span className="font-medium">{hero.availability.label}</span>
                <span className="hidden text-muted sm:inline">· {hero.availability.detail}</span>
              </span>
            )}
          </div>

          <h1 className="mt-8">
            <span className="anim-fade-up label-mono flex flex-wrap items-center gap-x-3 gap-y-1" style={{ ["--d" as string]: "60ms" }}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              <span className="text-accent">{profile.name}</span>
              <span className="text-muted"><span className="hidden sm:inline">· </span>{profile.title}</span>
            </span>
            <span className="mt-5 block font-display text-[clamp(2.5rem,5.2vw,5.1rem)] leading-[1.04] tracking-[-0.014em]">
              {words.map(({ word, em }, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span className={cn("anim-rise", em && "italic text-accent")} style={{ ["--i" as string]: i }}>
                    {word}
                  </span>
                  {i < words.length - 1 && " "}
                </span>
              ))}
            </span>
          </h1>

          <div className="anim-lift mt-8 max-w-xl" style={{ ["--d" as string]: "200ms" }}>
            <p className="text-[1.0625rem] leading-relaxed text-ink-2 md:text-lg">{hero.intro}</p>
          </div>

          <div
            className="anim-fade-up mt-10 flex flex-wrap items-center gap-3"
            style={{ ["--d" as string]: `${afterHeadline + 120}ms` }}
          >
            <MagneticButton href="#experience">
              See my work
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            {hasResume ? (
              <MagneticButton href={profile.links.resume} variant="ghost" external>
                <FileText className="size-4" />
                Résumé
              </MagneticButton>
            ) : (
              <span
                className="todo inline-flex min-h-12 items-center gap-2 rounded-full border border-dashed border-rule px-6 text-[0.9375rem]"
                title="Add public/resume.pdf to enable this button"
              >
                <FileText className="size-4" />
                Résumé (add public/resume.pdf)
              </span>
            )}
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center px-3 text-[0.9375rem] font-medium underline decoration-rule underline-offset-[6px] transition-colors hover:decoration-ink"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5 lg:pt-16">
          <div className="anim-panel-in" style={{ ["--d" as string]: "380ms" }}>
            <Panel
              title="coding-lambda / agent loop"
              status={<TraceStatus />}
              caption="A replay of how Coding Lambda works through a bug. The steps are real, the file names are made up."
            >
              <AgentTrace />
              <dl className="grid grid-cols-3 border-t border-panel-rule">
                {[
                  ["37.0%", "SWE-bench Verified"],
                  ["96.3%", "HumanEval"],
                  ["−47.6%", "tokens"],
                ].map(([v, k]) => (
                  <div key={k} className="border-r border-panel-rule px-4 py-3 last:border-r-0">
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.05em] whitespace-nowrap text-panel-muted">{k}</dt>
                    <dd className="mt-1 font-mono text-sm text-panel-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        </div>
      </div>

      {/* Status rail */}
      <div className="page-x mt-20 md:mt-28">
        <div
          className="anim-fade-up label-mono flex items-center justify-between gap-6 border-t border-rule py-4 text-muted"
          style={{ ["--d" as string]: `${afterHeadline + 300}ms` }}
        >
          <span className="flex items-center gap-4">
            <span>{profile.location}</span>
            <span className="hidden sm:inline">{profile.coordinates}</span>
            <span className="hidden md:inline">
              Local <LocalTime timeZone={profile.timeZone} />
            </span>
          </span>
          <a href="#about" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-ink">
            Index
            <ArrowDown className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
