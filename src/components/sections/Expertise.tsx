"use client";

import { AnimatePresence, m } from "motion/react";
import { BadgeCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { certifications, evidence, expertise, type EvidenceId, type Skill } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const IDS = Object.keys(evidence) as EvidenceId[];
const GROUPS = [
  { kind: "work" as const, label: "Work" },
  { kind: "project" as const, label: "Projects" },
];

function listNames(ids: EvidenceId[]) {
  const names = ids.map((id) => evidence[id].label);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/**
 * "Evidence matrix": every skill links to where it was used.
 * Hover/focus a skill → its roles/projects light up. Select one → its stack lights up.
 */
export function Expertise() {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [filter, setFilter] = useState<EvidenceId | null>(null);

  const counts = useMemo(() => {
    const c = Object.fromEntries(IDS.map((id) => [id, 0])) as Record<EvidenceId, number>;
    for (const g of expertise) for (const s of g.skills) for (const id of s.used) c[id] += 1;
    return c;
  }, []);

  const readout = skill
    ? skill.used.length
      ? { k: skill.name, v: `I used this at ${listNames(skill.used)}.` }
      : { k: skill.name, v: "I know this one, but it isn't tied to anything shown on this page." }
    : filter
      ? { k: evidence[filter].label, v: `${counts[filter]} of these skills were used here.` }
      : { k: "Pick a skill", v: "Hover or tap any skill to see where I used it. You can also pick a job or project." };

  return (
    <section id="expertise" aria-labelledby="expertise-h" className="page-x scroll-mt-20 py-20 md:py-36">
      <SectionHeader
        id="expertise-h"
        index="04"
        label="Skills"
        title="What I *work with.*"
        intro="Every skill here links back to a job or project where I used it. The dashed ones I know, but haven't shown on this page."
      />

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        {/* Evidence column */}
        <div className="min-w-0 lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            {GROUPS.map((g) => (
              <div key={g.kind}>
                <p className="label-mono mb-3 text-muted">{g.label}</p>
                <div
                  role="group"
                  aria-label={`Filter skills by ${g.label.toLowerCase()}`}
                  className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-8 md:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
                >
                  {IDS.filter((id) => evidence[id].kind === g.kind).map((id) => {
                    const lit = skill?.used.includes(id);
                    const selected = filter === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setFilter(selected ? null : id)}
                        className={cn(
                          "group relative flex min-h-11 shrink-0 items-center gap-3 rounded-full border px-4 text-left text-sm transition-colors duration-300",
                          "lg:min-h-10 lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-2.5 lg:last:border-b",
                          selected || lit ? "border-accent bg-accent-soft text-ink lg:bg-transparent" : "border-rule text-ink-2 hover:text-ink",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "hidden size-2 rounded-full border transition-all duration-300 lg:block",
                            selected || lit ? "scale-125 border-accent bg-accent" : "border-muted",
                          )}
                        />
                        <span className="whitespace-nowrap font-medium lg:flex-1">{evidence[id].label}</span>
                        <span className="font-mono text-xs tabular-nums text-muted">{counts[id]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Readout */}
            <div className="rounded-xl bg-panel p-5 text-panel-ink" aria-live="polite">
              <div className="label-mono flex items-center gap-2 text-panel-muted">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden />
                readout
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={readout.k}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: ease.outExpo }}
                  className="mt-3 min-h-[4.25rem]"
                >
                  <p className="font-display text-2xl leading-tight">{readout.k}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-panel-muted">{readout.v}</p>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Skill groups */}
        <div className="min-w-0 lg:col-span-8">
          {expertise.map((group, gi) => (
            <Reveal
              key={group.id}
              delay={Math.min(gi, 3) * 0.04}
              className="grid gap-4 border-t border-rule py-6 md:grid-cols-[10rem_1fr] md:gap-8"
            >
              <h3 className="font-medium md:pt-2">{group.label}</h3>
              <ul className="flex flex-wrap gap-2" aria-label={group.label}>
                {group.skills.map((s) => {
                  const shipped = s.used.length > 0;
                  const active = skill?.name === s.name;
                  const matches = filter ? s.used.includes(filter) : true;
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        onMouseEnter={() => setSkill(s)}
                        onMouseLeave={() => setSkill(null)}
                        onFocus={() => setSkill(s)}
                        onBlur={() => setSkill(null)}
                        onClick={() => setSkill(active ? null : s)}
                        className={cn(
                          "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-[0.875rem] transition-all duration-300",
                          shipped ? "border-solid" : "border-dashed",
                          active
                            ? "border-accent bg-accent text-paper"
                            : filter && matches
                              ? "border-accent bg-accent-soft text-ink"
                              : "border-rule text-ink-2 hover:border-ink hover:text-ink",
                          !matches && "opacity-30",
                        )}
                      >
                        {s.name}
                        <span className="sr-only">{shipped ? `, used in ${s.used.length} places` : ", in toolkit"}</span>
                        {shipped && (
                          <span aria-hidden className={cn("font-mono text-[0.625rem] tabular-nums", active ? "text-paper/70" : "text-muted")}>
                            ×{s.used.length}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-rule pt-5">
            <div className="label-mono flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
              <span className="flex items-center gap-2">
                <span className="h-3 w-5 rounded-full border border-ink-2" aria-hidden /> used in my work
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-5 rounded-full border border-dashed border-ink-2" aria-hidden /> also familiar
              </span>
            </div>
            {certifications.map((c) => (
              <span key={c} className="inline-flex items-center gap-2 text-sm text-ink-2">
                <BadgeCheck className="size-4 text-accent" aria-hidden />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
